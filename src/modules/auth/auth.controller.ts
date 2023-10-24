import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  Delete,
  UseInterceptors,
  UseGuards,
  Param,
  Patch,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupResponseDto,
  SignUpUserDto,
  TokenDto,
} from './dto/sign-up-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../app/common/decorator/public.decorator';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInUserDto } from './dto/sign-in-user.dto';
import {
  ResetPasswordDto,
  ResetPasswordResDto,
  VerfiyOtpResponse,
} from './dto/reset-password.dto';
import { SendOtpCodeDto } from './dto/send-otp-code.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly } from 'src/app/middlewares/user-exist.guard';
import { JwtService } from '@nestjs/jwt';
import { UserResponseModel } from './model/user-response.model';

//Public
@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {}


  /// New Guest User
  @Public()

  @Post('guest-user')
  @ApiOperation({ summary: 'New Guest User' })
  @ApiResponse({ type: UserResponseModel })
  async guestUser(): Promise<SignupResponseDto> {
    return this.authService.createGuestUser();
  }

  // Yeni kullanıcı kaydı oluşturur.
  //@Public() // to skip the jwt authentication
  @Post('sign-up')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({
    description: 'Sign up',
    type: SignUpUserDto,
  })
  @ApiResponse({ type: SignupResponseDto })
  @Public()
  async signUp(
    @Body() authUserDto: SignUpUserDto,
    @Req() req,
  ): Promise<SignupResponseDto> {
 
    return this.authService.signUp(authUserDto);
  }

  // Kullanıcı girişi
  @UsePipes(new ValidationPipe({ transform: true }))
  //@Public() // to skip the jwt authentication
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({ type: SignupResponseDto })
  async signIn(
    @Req() req,
    @Body() authUserDto: SignInUserDto,
  ): Promise<SignupResponseDto> {
    const sessionId = await this.jwt.decode(
      req.headers.authorization?.split(' ')[1],
    )['sessionId'];
    return this.authService.signIn(authUserDto, sessionId);
  }

  //Şifre Sıfırlama
  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Send otp code to email for reset link' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(
    @Body() sendOtpCode: SendOtpCodeDto,
  ): Promise<ResetPasswordResDto> {
    return this.authService.sendResetPasswordCode(sendOtpCode);
  }

  //OTP doğrulama
  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyOtp(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
    return this.authService.verifyOTP(resetPasswordDto);
  }

  //Update Password
  @Post('update-password')
  @Public()
  @ApiOperation({ summary: 'Update Password' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePassword(
    @Body() updatePassword: UpdatePasswordDto,
  ): Promise<any> {
    return this.authService.updatePassword(updatePassword);
  }

  //Update current user
  @Post('update-profile')
  @ApiOperation({ summary: 'Update Profile' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Body() updateProfile: UpdateProfileDto,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    return this.authService.updateProfile(updateProfile, user);
  }

  //Get current user
  @Get('get-current-user')
  @ApiOperation({ summary: 'Get Current User' })
  async getCurrentUser(@Req() req: any): Promise<any> {
    const user = req.user;
    return this.authService.validateUserById(user.id);
  }

  //Delete current user
  @Delete('delete-current-user')
  @ApiOperation({ summary: 'Delete Current User' })
  async deleteCurrentUser(@Req() req: any): Promise<any> {
    const user = req.user;
    return this.authService.deleteProfile(user);
  }

  //Logout current user
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() req: any): Promise<any> {
    const user = req.user;
    return this.authService.logout(user);
  }

  //Tüm kullanıcıları getirme
  @Get('get-all-users')
  @ApiOperation({ summary: 'Get All Users' })
  @UseGuards(AdminOnly)
  async getAllUsers(): Promise<any> {
    return this.authService.getAllUsers();
  }

  //Kullanıcı detayı
  @Get('get-user/:id')
  @ApiOperation({ summary: 'Get User' })
  @UseGuards(AdminOnly)
  async getUser(@Param('id') id: string): Promise<any> {
    return this.authService.getUserById(id);
  }

  //Kulanıcıyı silme
  @Delete('delete-user/:id')
  @ApiOperation({ summary: 'Delete User' })
  @UseGuards(AdminOnly)
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.authService.deleteUserById(id);
  }

  //Admin olup olmamasını güncelleme
  @Patch('update-user-admin-status/:id/:isAdmin')
  @ApiOperation({ summary: 'Update User Admin Status' })
  @UseGuards(AdminOnly)
  async updateUserAdminStatus(
    @Param('id') id: string,
    @Param('isAdmin') isAdmin: boolean,
  ): Promise<any> {
    return this.authService.updateAdminStatus(id, isAdmin);
  }

 /*  //Google giriş
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleAuth(@Req() req) {}

  @Get('/google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Headers() headers, @Req() req) {
    const sessionId = headers['user-agent'];
    /*const sessionId = await this.jwt.decode(
      req.headers.authorization?.split(' ')[1],
    )['sessionId'];
    console.log(sessionId);
    return this.authService.createFirebaseUserGoogle(req.user, sessionId);
  }

  //Facebook Giriş
  @Get('facebook')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/callback')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async AuthRedirectFacebook(@Headers() headers, @Req() req) {
    const sessionId = headers['user-agent'];
    /* const sessionId = await this.jwt.decode(
       req.headers.authorization?.split(' ')[1],
     )['sessionId'];
    return await this.authService.createFirebaseUserFacebook(
      req.user,
      sessionId,
    );
  }

  */
}
