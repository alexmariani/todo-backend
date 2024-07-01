import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { TodoModule } from './todo/todo.module';
import { UserController } from './user/controllers/user/user.controller';
import { UserMapperService } from './user/services/user-mapper/user-mapper.service';
import { UserService } from './user/services/user/user.service';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './filters/exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      autoLoadEntities: true,
      synchronize: true,
      database: path.resolve(__dirname, '..', 'db.sqlite'),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TodoModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL di base per servire i file
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    UserMapperService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
