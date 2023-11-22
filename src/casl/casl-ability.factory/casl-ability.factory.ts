import {
  AbilityBuilder,
  AbilityClass,
  ConditionsMatcher,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Address } from 'src/addresses/entities/address.entity';
import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  List = 'list',
  Retrieve = 'retrieve',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<typeof User | typeof Company | typeof Address>
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const lambdaMatcher: ConditionsMatcher<MatchConditions> = matchConditions =>
      matchConditions;

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    }

    can(
      [Action.Retrieve, Action.Update, Action.Delete],
      Company,
      ({ representative }) => representative.id === user.id,
    );
    can(Action.Retrieve, Company, ({ id }) => id === user.company?.id);
    can(
      [Action.Update, Action.Retrieve, Action.Delete],
      User,
      ({ id }) => id === user.id,
    );

    return build({
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
