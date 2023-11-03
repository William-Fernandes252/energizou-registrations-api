import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Adress } from 'src/adresses/entities/adress.entity';
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
  | InferSubjects<typeof User | typeof Company | typeof Adress>
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    }

    can([Action.Retrieve, Action.Update, Action.Delete], Company, {
      representative: user,
    });
    can(Action.Retrieve, Company, { id: user.company.id });
    can([Action.Update, Action.Retrieve, Action.Delete], User, { id: user.id });

    return build({
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
