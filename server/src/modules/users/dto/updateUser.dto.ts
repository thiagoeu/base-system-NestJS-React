import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 1,
    description: 'User id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
