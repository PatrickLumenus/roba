import {
  Collective, 
  Actions, 
  Resource, 
  Actor, 
  Permission, 
  GrantSet
} from './../../src';

describe('Testing Permissions', () => {
  const defaultPermissions = [
    Permission.Protected('accounts'),
    Permission.Protected('posts')
  ];
  const users = new Collective('users', defaultPermissions);

  const admins = Collective.InheritFrom(users, 'admins', [
    Permission.All('accounts')
  ]);

  const accounts = Resource.Collecton('accounts');
  const posts = Resource.Collecton('posts');

  it('should declare a collective', () => {
    expect(users.name).to.equal('users');
    expect(users.scope).to.equal('*');
    //expect(users.permissions).to.equal(defaultPermissions);

    expect(admins.name).to.equal('admins');
    expect(admins.scope).to.equal('*');
  })

  it("should define a resource", () => {
    expect(accounts.name).to.equal('accounts');
    expect(accounts.isCollection).to.be.true;
    expect(accounts.isInstance).to.be.false;
    expect(accounts.id).to.be.null;
    expect(accounts.owner).to.be.null;

    expect(posts.name).to.equal('posts');
    expect(posts.isCollection).to.be.true;
    expect(posts.isInstance).to.be.false;
    expect(posts.id).to.be.null;
    expect(posts.owner).to.be.null;
  });

  it('should prohibit users from creating accounts', () => {
    expect(users.can(Actions.Create, accounts)).to.be.false;
    expect(users.cannot(Actions.Create, accounts)).to.be.true;
    expect(users.can(Actions.View, accounts)).to.be.true;
    expect(users.cannot(Actions.View, accounts)).to.be.false;
    expect(users.can(Actions.Update, accounts)).to.be.false;
    expect(users.cannot(Actions.Update, accounts)).to.be.true;
    expect(users.can(Actions.Destroy, accounts)).to.be.false;
    expect(users.cannot(Actions.Destroy, accounts)).to.be.true;
  });

  it('should allow admin users to create accounts.', () => {
    expect(admins.can(Actions.Create, accounts)).to.be.true;
    expect(admins.cannot(Actions.Create, accounts)).to.be.false;
  });

  const bob = Actor.DerivedFrom(users, 'bob');
  const billy = Actor.DerivedFrom(admins, 'billy-admin');
  const bobAccount = Resource.Instance(accounts.name, 'abcde', bob.id);
  const billyAccount = Resource.Instance(accounts.name, '12345', billy.id);
  
  it('should create instances with the same information.', () => {
    expect(bob.id).to.equal('bob');
    expect(bob.name).to.equal(users.name);
    expect(bob.can(Actions.Create, accounts)).to.be.true;
    expect(bob.can(Actions.Update, bobAccount)).to.be.true;
    expect(bob.can(Actions.Update, billyAccount)).to.be.false;
  });
})