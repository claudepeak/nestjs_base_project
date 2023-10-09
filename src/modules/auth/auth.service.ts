import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {SignupResponseDto, SignUpUserDto} from './dto/sign-up-user.dto';
import {PrismaService} from 'src/prisma/prisma.service';
import {ConfigService} from '@nestjs/config';
import {User} from '@prisma/client';
import {JwtService} from '@nestjs/jwt';
import * as argon from 'argon2';
import {SignInUserDto} from './dto/sign-in-user.dto';
import {RedisService} from 'src/app/services/redis/redis.service';
import {MailService} from 'src/app/services/mailer/mail.service';
import {ResetPasswordDto} from './dto/reset-password.dto';
import {SendOtpCodeDto} from './dto/send-otp-code.dto';
import {v4 as uuidv4} from 'uuid';
import {UpdatePasswordDto} from './dto/update-password.dto';
import {UserResponseModel} from './model/user-response.model';
import {UpdateProfileDto} from './dto/update-profile.dto';

import {SendMailDto} from 'src/app/services/mailer/dto/send-mail.dto';
import {isValidObjectId} from 'src/app/common/validator/object-id-validator.util';
import {EmailTemplates} from 'templates/enum/email-templates.enum';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redisService: RedisService,
        private readonly mailerService: MailService,
    ) {
    }

    /*message =
      "Hey there! Right now, we're buzzing with excitement as we launch exclusively in North Carolina! But don't worry, we've got big plans and your area is on our radar. Why not jump on our waiting list? You'll be the first to know when we roll out our service to your zip code. Can't wait to have you on board! Or, try again with a valid zip code.";
  */
    async generateSessionId(length = 10) {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let sessionId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            sessionId += characters.charAt(randomIndex);
        }
        return sessionId;
    }

    async createToken() {
        const sessionId = await this.generateSessionId();
        await this.prisma.session.create({
            data: {
                sessionId: sessionId,
            },
        });
        return {access_token: await this.generateAccessToken(sessionId)};
    }

    /// This method is used to sign up a new user
    async signUp(
        authUserDto: SignUpUserDto,
        sessionId: string,
    ): Promise<SignupResponseDto> {
        try {
            const {email, password, name, username, is_admin} =
                authUserDto;

            const checkUserEmail = await this.prisma.user.findFirst({
                where: {email},
            });

            if (checkUserEmail) {
                throw new ConflictException(
                    'This email is already taken. Please try again with a different email.',
                );
            }

            const hash = await argon.hash(password);

            // Create a new user entry in the database
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    userName: username,
                    password: hash,

                    isAdmin: is_admin,
                },
            });

            const userResponseModel: UserResponseModel = {
                id: user.id,
                email: user.email,
                name: user.name,
                userName: user.userName,
                createdAt: user.createdAt,
                isAdmin: user.isAdmin,
                updatedAt: user.updatedAt,
            };

            return {
                access_token: await this.generateAccessToken(sessionId, user),
                user: userResponseModel,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                error.statusCode || HttpStatus.BAD_REQUEST,
            );
        }
    }

    /// signIn is a function that signs in a user and returns an access token and the user
    async signIn(authUserDto: SignInUserDto, sessionId) {
        const {email, password} = authUserDto;

        const user = await this.validatePassword(email, password);

        const userResponseModel: UserResponseModel = {
            id: user.id,
            email: user.email,
            userName: user.userName,
            name: user.name,
            createdAt: user.createdAt,
            isAdmin: user.isAdmin,
            updatedAt: user.updatedAt,
        };
        //login ile sessionId ve user ı eşleştirme
        await this.prisma.session.update({
            data: {
                user_id: user.id,
            },
            where: {
                sessionId: sessionId,
            },
        });
        return {
            access_token: await this.generateAccessToken(sessionId, user),
            user: userResponseModel,
        };
    }

    /// validateUser is a helper function that validates a user's password if the user exists with the given email
    async validatePassword(email: string, password: string): Promise<User> {
        const user = await this.findUserByEmail(email);
        const isValid = user && (await argon.verify(user.password, password));
        if (!isValid)
            throw new UnauthorizedException(
                'Invalid credentials, password is incorrect',
            );

        return user;
    }

    /// This method is used for the find user by email
    async findUserByEmail(email: string) {
        return await this.prisma.user.findFirst({
            where: {
                email,
            },
        });
    }

    /// This method is used to validate user by id
    async validateUserById(id: string): Promise<UserResponseModel> {
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials, user not found');
        }

        const userResponseModel: UserResponseModel = {
            id: user.id,
            email: user.email,
            userName: user.userName,
            name: user.name,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,

        };

        return userResponseModel;
    }

    /// accessToken is a helper function that generates an access token for a user
    async generateAccessToken(sessionId: string, user?: User): Promise<string> {
        const payload: Record<string, any> = {
            sessionId: sessionId,
        };

        // Eğer user parametresi geçilmişse, payload'a ekleyin
        if (user) {
            payload.sub = user.id;
            payload.email = user.email;
            payload.isAdmin = user.isAdmin;
        }

        const options = {
            expiresIn: this.config.get('JWT_EXPIRATION'),
            secret: this.config.get('JWT_SECRET'),
        };

        return this.jwt.signAsync(payload, options);
    }

    /**Reset Password**/

    // Generate OTP
    async generateOTP(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await this.redisService.set(email + '_otp', otp);
        return otp;
    }

    // Send OTP to email
    async sendResetPasswordCode(sendOtpCodeDto: SendOtpCodeDto) {
        const checkUser = await this.prisma.user.findFirst({
            where: {email: sendOtpCodeDto.email},
        });

        if (!checkUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const {email} = sendOtpCodeDto;
        const otp = await this.generateOTP(email);

        const testMails = [
            'hivinpolat_3823@hotmail.com',
            'yazicifatihcan@gmail.com',
        ];
        console.log(email);
        if (!testMails.includes(email)) {
            await this.redisService.set(email + '_otp', otp);

            const sendmailDto = {
                email: email,
                subject: 'OTP code for reset password',
                template: EmailTemplates.OTP_CODE,
                context: {
                    otpCode: otp,
                },
            };

            await this.mailerService.sendEmail(sendmailDto as SendMailDto);
        } else {
            await this.redisService.set(email + '_otp', '123456');
            console.log(await this.redisService.get(email + '_otp'));
        }

        return {
            message: 'OTP is sent',
            statusCode: HttpStatus.CREATED,
        };
    }

    // Verify OTP code
    async verifyOTP(resetPasswordDto: ResetPasswordDto) {
        const {email, otpCode} = resetPasswordDto;
        const redisOtp = parseInt(await this.redisService.get(email + '_otp'));
        console.log(email);
        console.log('RedisOTP ' + redisOtp);

        if (redisOtp === parseInt(otpCode)) {
            await this.deleteOTP(email);

            /// Generate UUID for update password
            const transactionId = uuidv4();
            await this.redisService.set(email + '_transactionId', transactionId);
            console.log('Generated TransactionID ' + transactionId);

            return {
                message: 'OTP is valid',
                success: VerificationStatusEnum.SUCCESS,
                transactionId: transactionId,
            };
        } else {
            throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
        }
    }

    // Delete OTP
    async deleteOTP(email: string) {
        await this.redisService.del(email + '_otp');
    }

    // Delete UUID
    async deleteTransactionId(email: string) {
        await this.redisService.del(email + '_transactionId');
    }

    // Update password
    async updatePassword(updatePassword: UpdatePasswordDto) {
        const {email, password, transactionId} = updatePassword;

        const redisUUID = await this.redisService.get(email + '_transactionId');

        if (redisUUID === transactionId) {
            const hash = await argon.hash(password);

            await this.prisma.user.updateMany({
                where: {
                    email,
                },
                data: {
                    password: hash,
                },
            });

            await this.deleteTransactionId(email);

            return {
                message: 'Password updated successfully',
                success: VerificationStatusEnum.SUCCESS,
            };
        } else {
            throw new HttpException(
                'Transaction ID is invalid',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /// User update profile
    async updateProfile(updateProfileDto: UpdateProfileDto, user: User) {
        try {
            const {userName, password, email, name} = updateProfileDto;

            const data: { [key: string]: string } = {};

            if (password) {
                const hash = await argon.hash(password);
                data.password = hash;
            }

            if (email) {
                const checkUserEmail = await this.prisma.user.findMany({
                    where: {email, id: {not: user.id}},
                });

                if (checkUserEmail && checkUserEmail.length > 0) {
                    throw new ConflictException(
                        'This email is already taken. Please try again with a different email.',
                    );
                }
            }

            if (email) data.email = email;
            if (userName) data.userName = userName;
            if (name) data.name = name;
            if (password) {
                if (password.length < 6) {
                    throw new HttpException(
                        'Password must be at least 6 characters',
                        HttpStatus.BAD_REQUEST,
                    );
                }

                const hash = await argon.hash(password);
                data.password = hash;
            }

            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: data,
            });

            return {
                message: 'Profile updated successfully',
                success: VerificationStatusEnum.SUCCESS,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                error.statusCode || HttpStatus.BAD_REQUEST,
            );
        }
    }

    /// Get all users
    async getAllUsers() {
        const users = await this.prisma.user.findMany({});

        if (!users) {
            throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
        }

        const usersResponseModel: UserResponseModel[] = [];

        users.forEach((user) => {
            const userResponseModel: UserResponseModel = {
                id: user.id,
                email: user.email,
                userName: user.userName,
                name: user.name,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            return usersResponseModel.push(userResponseModel);
        });

        return usersResponseModel;
    }

    /// Get user by id
    async getUserById(id: string) {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return delete user.password, user;
    }

    /// User delete profile
    async deleteProfile(user: User) {
        try {
            await this.prisma.$transaction([
                this.prisma.user.delete({
                    where: {
                        id: user.id,
                    },
                }),
            ]);

            return {
                message: 'Profile deleted successfully',
                success: VerificationStatusEnum.SUCCESS,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                error.statusCode || HttpStatus.BAD_REQUEST,
            );
        }
    }

    ///delete user with id
    async deleteUserById(id: string) {
        try {
            if (!isValidObjectId(id)) {
                throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            await this.prisma.$transaction([
                this.prisma.user.delete({
                    where: {
                        id: id,
                    },
                }),
            ]);

            return {
                message: 'Profile deleted successfully',
                success: VerificationStatusEnum.SUCCESS,
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                error.statusCode || HttpStatus.BAD_REQUEST,
            );
        }
    }

    /// User logout
    async logout(user: User) {
        /*    try {
              await this.prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  refreshToken: null,
                },
              });
            } catch (error) {
              throw new HttpException(
                error.message,
                error.statusCode || HttpStatus.BAD_REQUEST,
              );
            } */
    }

    async updateAdminStatus(id: string, isAdmin: boolean) {
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                isAdmin,
            },
        });

        return delete user.password, user;
    }

    async createFirebaseUserGoogle(profile: any, sessionId: any): Promise<any> {
        // Kullanıcıyı e-posta ile arayarak kontrol edin
        const uniqueSessionId = `${sessionId}-google`;
        try {
            const userRecord = await admin.auth().getUserByEmail(profile._json.email);

            return userRecord.uid;
        } catch (error) {
            // Kullanıcı bulunamazsa veya hata oluşursa, yeni bir kullanıcı oluşturabilirsiniz
            const {uid} = await admin.auth().createUser({
                uid: profile._json.id, // Google'dan gelen benzersiz kimlik
                email: profile._json.email,
                displayName: profile._json.displayName,
                // Diğer kullanıcı verileri
            });
            const user = await this.prisma.user.create({
                data: {
                    email: profile._json.email,
                    name: profile._json.displayName,
                    userName: profile._json.displayName,
                    isAdmin: false,
                },
            });
            /*  await this.prisma.session.create({
                data: {
                  sessionId: uniqueSessionId,
                  user_id: user.id,
                },
              });*/

            // Kullanıcı oluşturuldu,
            return {
                //access_token: await this.generateAccessToken(sessionId, user),
                user: user,
            };
        }
    }

    async createFirebaseUserFacebook(profile: any, sessionId): Promise<any> {
        const userEmail = profile._json.email;
        const uniqueSessionId = `${sessionId}-facebook`;
        // Kullanıcının e-posta adresi ile Firebase'deki kullanıcıyı kontrol edin
        try {
            const userRecord = await admin.auth().getUserByEmail(userEmail);

            // Kullanıcı mevcutsa, mevcut kullanıcı bilgilerini döndürebilirsiniz
            return userRecord.uid;
        } catch (error) {
            // Kullanıcı bulunamazsa veya hata oluşursa, yeni bir kullanıcı oluşturabilirsiniz
            if (error.code === 'auth/user-not-found') {
                const newUser = {
                    email: userEmail,
                    displayName: profile._json.displayName,
                };

                const createdUser = await admin.auth().createUser(newUser);

                const user = await this.prisma.user.create({
                    data: {
                        email: profile._json.email,
                        name: profile._json.displayName,
                        userName: profile._json.displayName,
                        isAdmin: false,
                    },
                });
                /*await this.prisma.session.create({
                  data: {
                    sessionId: uniqueSessionId,
                    user_id: user.id,
                  },
                });*/
                return {
                    //access_token: await this.generateAccessToken(sessionId, user),
                    user: createdUser,
                };
            } else {
                // Diğer hatalar için gerekli işlemi yapabilirsiniz
                console.error('Hata:', error);
                throw error;
            }
        }
    }


}

enum VerificationStatusEnum {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}
