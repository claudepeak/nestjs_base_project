import {ApiProperty} from '@nestjs/swagger';

export class UserResponseModel {
    @ApiProperty({type: String})
    id: string;

    @ApiProperty({type: String})
    name: string;

    @ApiProperty({type: String})
    email: string;

    @ApiProperty({type: String})
    userName: string;

    @ApiProperty({type: Boolean})
    isAdmin: boolean;

    @ApiProperty({type: Date})
    createdAt: Date;

    @ApiProperty({type: Date})
    updatedAt: Date;

}
