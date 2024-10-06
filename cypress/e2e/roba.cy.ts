import {
  Collective,
  Actions,
  Resource,
  Actor,
  Permission,
  parsePermissionsList,
  ResourceInstance,
} from "./../../src";

describe("Testing Permissions", () => {
  const accounts = Resource.Collection("accounts");
  const posts = Resource.Collection("posts");

  const defaultPermissions = [
    Permission.Protected(accounts),
    Permission.Protected(posts),
  ];
  const users = new Collective("users", defaultPermissions);

  const admins = Collective.InheritFrom(users, "admins", [
    Permission.All(accounts),
  ]);

  it("should declare a collective", () => {
    expect(users.name).to.equal("users");
    expect(users.scope).to.equal("*");
    //expect(users.permissions).to.equal(defaultPermissions);

    expect(admins.name).to.equal("admins");
    expect(admins.scope).to.equal("*");
  });

  it("should define a resource", () => {
    expect(accounts.name).to.equal("accounts");
    expect(posts.name).to.equal("posts");
  });

  it("should prohibit users from creating accounts", () => {
    expect(users.can.create(accounts)).to.be.false;
    expect(users.cannot.create(accounts)).to.be.true;
    expect(users.can.read(accounts)).to.be.true;
    expect(users.cannot.read(accounts)).to.be.false;
    expect(users.can.update(accounts)).to.be.false;
    expect(users.cannot.update(accounts)).to.be.true;
    expect(users.can.delete(accounts)).to.be.false;
    expect(users.cannot.delete(accounts)).to.be.true;
  });

  it("should allow admin users to create accounts.", () => {
    expect(admins.can.create(accounts)).to.be.true;
    expect(admins.cannot.create(accounts)).to.be.false;
    expect(admins.can.read(accounts)).to.be.true;
    expect(admins.cannot.read(accounts)).to.be.false;
    expect(admins.can.update(accounts)).to.be.true;
    expect(admins.cannot.update(accounts)).to.be.false;
    expect(admins.can.delete(accounts)).to.be.true;
    expect(admins.cannot.delete(accounts)).to.be.false;
  });

  const bob = Actor.DerivedFrom(users, "bob");
  const billy = Actor.DerivedFrom(admins, "billy-admin");
  const bobAccount = Resource.Instance(accounts.name, "abcde", bob.id);
  const billyAccount = Resource.InstanceOf(accounts, "12345", billy);

  it("should create valid resource instances.", () => {
    expect(bobAccount.id).to.equal("abcde");
    expect(bobAccount.name).to.equal(accounts.name);
  });

  it("should create instances with the same information as the collectives they are part of.", () => {
    expect(bob.id).to.equal("bob");
    expect(bob.permissions.length).to.equal(2);
    expect(bob.name).to.equal(users.name);
    expect(bob.can.create(bobAccount)).to.be.true;
    expect(bob.can.update(bobAccount)).to.be.true;
    expect(bob.can.update(billyAccount)).to.be.false;
    expect(billy.can.update(billyAccount)).to.be.true;
  });

  it("should be able to serialize and reconstruct permissions", () => {
    const permissions = bob.permissionsList;
    const recreatedPermissions = parsePermissionsList(permissions);
    expect(bob.permissions).to.deep.equal(recreatedPermissions);
  });

  it("should be able to view posts when 2+2 = 4", () => {
    expect(bob.can.read(posts, () => 2 + 2 == 4)).to.be.true;
  });

  it("should not be able to create posts when 2+2 = 5", () => {
    expect(bob.can.create(posts, () => 2 + 2 == 5)).to.be.false;
  });

  it("should be able to update billy's account when billy owns it", () => {
    expect(
      billy.can.update(
        billyAccount,
        (entity, _, resource) =>
          entity.identifier === (resource as ResourceInstance).owner,
      ),
    ).to.be.true;
  });

  it("should not be able to update bob's account if he does not own it.", () => {
    expect(
      bob.can.update(
        billyAccount,
        (entity, _, resource) =>
          entity.identifier === (resource as ResourceInstance).owner,
      ),
    ).to.be.false;
  });

  it("should not be able to view posts if 1 + 1 == 2", () => {
    expect(bob.cannot.read(posts, () => 1 + 1 == 2)).to.be.true;
  });

  it("should be able to view posts if 1 + 1 == 3", () => {
    expect(bob.cannot.read(posts, () => 1 + 1 == 3)).to.be.false;
  });

  it("should not be able to view billy's account if he does not own it.", () => {
    expect(
      bob.cannot.read(
        billyAccount,
        (bob, _, billyAccount) =>
          bob.identifier !== (billyAccount as ResourceInstance).owner,
      ),
    ).to.be.true;
  });
});
