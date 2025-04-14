import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { CreateUserDto, PaginationDto, UpdateUserDto, USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit{
  private usersService: UsersServiceClient;

  constructor(
    @Inject(AUTH_SERVICE) private client: ClientGrpc) {}

    onModuleInit() {
      this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME)
    }

  create(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAll() {
    return this.usersService.findAllUsers({});
  }

  findOne(id: string) {
    return this.usersService.findOneUser({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { id: _, ...rest } = updateUserDto;
    return this.usersService.updateUser({ id, ...rest });
  }

  remove(id: string) {
    return this.usersService.removeUser({ id });
  }

  emailUsers() {
    // users with $ to represent that it is a subject object
    const users$ = new ReplaySubject<PaginationDto>();
    users$.next({ page: 0, skip: 25 });
    users$.next({ page: 1, skip: 25 });
    users$.next({ page: 2, skip: 25 });
    users$.next({ page: 3, skip: 25 });

    users$.complete();

    let chunkNumber = 1;

    this.usersService.queryUser(users$).subscribe(users => {
      console.log('Chunk',chunkNumber, users);
      chunkNumber+=1;
    } )
  }
}
