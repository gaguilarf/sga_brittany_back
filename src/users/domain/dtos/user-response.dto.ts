import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ example: 'Juan Pérez', required: false })
  fullname?: string;

  @ApiProperty({ example: 'admin@brittany.edu.pe', required: false })
  email?: string;

  @ApiProperty({ example: '987654321', required: false })
  phone?: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
