import { describe, it, expect } from "vitest";
import { resolveRole } from "./roles";

describe("resolveRole", () => {
  it("returns ADMIN for employe with admin role name", () => {
    expect(
      resolveRole({ employe: { role_employe: { nom_role: "Admin" } }, client: null })
    ).toBe("ADMIN");
  });
  it("returns EMPLOYE for a non-admin employe", () => {
    expect(
      resolveRole({ employe: { role_employe: { nom_role: "Meunier" } }, client: null })
    ).toBe("EMPLOYE");
  });
  it("returns EMPLOYE for an employe with no role", () => {
    expect(resolveRole({ employe: { role_employe: null }, client: null })).toBe("EMPLOYE");
  });
  it("returns CLIENT when only client present", () => {
    expect(resolveRole({ employe: null, client: { id_client: 1 } })).toBe("CLIENT");
  });
  it("defaults to CLIENT when nothing present", () => {
    expect(resolveRole({ employe: null, client: null })).toBe("CLIENT");
  });
});
