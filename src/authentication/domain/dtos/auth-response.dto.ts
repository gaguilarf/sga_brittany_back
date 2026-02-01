import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  fullname: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Role ID',
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: 'Role name',
    example: 'Administrador',
  })
  roleName?: string;

  @ApiProperty({
    description: 'Access token (only included in login response)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  accessToken?: string;
}
