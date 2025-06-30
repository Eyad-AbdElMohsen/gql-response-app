import { Field, Int, ObjectType } from '@nestjs/graphql';

export function generateGqlResponse<T, k>(
  Tclass: ClassType<T> | ClassType<T>[],
  isArray?: k,
) {
  let className: string;
  if (isArray) className = Tclass[0].name;
  else className = (Tclass as ClassType<T>).name;

  type DataSingleType = {
    data: T;
  };
  type DataTypeAsArray = {
    data: T[];
  };
  type DataType = k extends boolean ? DataTypeAsArray : DataSingleType;

  @ObjectType(`Gql${className}Response`)
  abstract class GqlResponse {
    @Field(() => Int)
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field(() => (isArray ? [Tclass] : Tclass))
    data?: DataType;
  }

  return GqlResponse;
}

export const GqlStringResponse = generateGqlResponse(String);
export const GqlBooleanResponse = generateGqlResponse(Boolean);
export const GqlStringArrayResponse = generateGqlResponse([String], true);

export type ClassType<T> = {
  new (...args: any[]): T; // constructor
};
