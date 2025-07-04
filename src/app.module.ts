import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { createGqlConfig } from './gql/gql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { UserModule } from './gql/user/user.module';
import { User } from './gql/user/user.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GqlResponseInterceptor } from './gql/gql.response.interceptor';
import { GraphQLExceptionsFilter } from './filters/excepion.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => createGqlConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: +configService.get('PORT'),
        username: configService.get('USERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        entities: [User],
        synchronize: true,
      }),
    }),
    UserModule,
  ],
  providers: [
    AppResolver,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GqlResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GraphQLExceptionsFilter,
    },
  ],
})
export class AppModule {}
