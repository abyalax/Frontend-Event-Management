import type { Prisma } from '~/generated/prisma/client';
import { UserRepository } from '~/layers/users/server/repositories/users.repository';
import { Service } from '~/layers/shared/server/abstract/services';
import type { MetaRequest, MetaResponse } from '~/layers/shared/app/types/meta';
import type { User } from '~/layers/users/types/index';
import { UserMapper, type UserRoles } from '~/layers/users/server/validators/users.dto';

type ListResponse = {
  items: User[];
  meta: MetaResponse;
};

class UserService extends Service<UserRepository> {
  constructor() {
    super(new UserRepository());
  }
  _getRepository = () => this.repository;
  _getModel = () => this._getModel;

  async list(params: MetaRequest<User>, where: Prisma.UserWhereInput): Promise<ListResponse> {
    const { page, per_page, search, sort_by, sort_order } = params;
    const cacheKey = JSON.stringify(params);

    const cached = await this.repository.cache.get(cacheKey);
    if (cached) return cached as ListResponse;

    const data = await this.repository.paginate<UserRoles, Prisma.UserInclude>({
      page,
      per_page,
      where,
      order_by: {
        [sort_by as string]: sort_order,
      },
      include: {
        user_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
      search: {
        term: search,
        fields: ['email', 'name'],
        mapper: {
          name: (term) => ({
            name: { contains: term, mode: 'insensitive' },
          }),
          email: (term) => ({
            email: { contains: term, mode: 'insensitive' },
          }),
        },
      },
    });

    const mapped = data.items.map((e) => UserMapper.toDTO(e, false));
    const result = {
      items: mapped,
      meta: data.meta,
    };

    this.repository.cache.set(cacheKey, result, { ttl: 600 });
    return result;
  }

  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async findById(id: number, withPassword: boolean = false) {
    const cached = await this.repository.cache.get(String(id));
    if (cached) return cached as User;

    const data = await this.repository.findWithRolesAndPermissions({ id }, withPassword);

    this.repository.cache.set(String(id), data, { ttl: 600 });

    return data;
  }

  findUser(where: Prisma.UserWhereUniqueInput) {
    return this.repository.findWithRolesAndPermissions(where);
  }

  create(data: Prisma.UserCreateInput) {
    return this.repository.create(data);
  }

  update(id: number, data: Prisma.UserUpdateInput) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    const result = this.repository.delete(id);
    // Clear cache for this user
    this.repository.cache.delete(String(id));
    return result;
  }
}

export const userService = new UserService();
