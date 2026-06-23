export const AUTH_ROLES = {
  admin: "admin",
  buyer: "buyer",
  deliveryPartner: "delivery_partner",
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
};
