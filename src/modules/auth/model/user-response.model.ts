import {ApiProperty} from '@nestjs/swagger';
import { UserTypeEnums } from 'src/app/common/enums/user-type.enum';

export class UserResponseModel {
    @ApiProperty({type: String})
    id: string;

    @ApiProperty({type: String})
    name: string;

    @ApiProperty({type: String})
    email: string;

    @ApiProperty({type: Boolean})
    isAdmin: boolean;

    @ApiProperty({type: Date})
    createdAt: Date;

    @ApiProperty({})
    userType: string;

    @ApiProperty({type: Date})
    updatedAt: Date;

}
