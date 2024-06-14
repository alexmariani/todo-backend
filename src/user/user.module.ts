import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./controllers/user/user.controller";
import { UserMapperService } from "./services/user-mapper/user-mapper.service";
import { UserService } from "./services/user/user.service";
import { Module } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserMapperService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule]
})
export class UserModule { }
