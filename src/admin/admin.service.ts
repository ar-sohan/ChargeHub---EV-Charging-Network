import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  private users = [
    { id: '1', title: 'Learn NestJS', status: 'active' },
    { id: '2', title: 'Build API', status: 'done' },
  ];
  searchOneUser(id: string) {
    return this.users.find((user) => user.id === id);
  }
  allUsers(status?: string) {
    if (status) {
      return this.users.filter((user) => user.status == status);
    }
    return this.users;
  }
  adminLogin(): string {
    return 'Hi from post';
  }
  getDashboard(): string {
    return 'Welcome to the admin dashboard';
  }
  patchHi(): string {
    return 'Hi from patch';
  }
  putHi(): string {
    return 'Hi from put';
  }
  deleteHi(): string {
    return 'Hi from delete';
  }
}
