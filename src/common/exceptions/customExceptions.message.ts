export const exceptionInvalidPasswordFormat = (label: string) =>
  `${label} must contain at least 8 characters (max 12), one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)`;

export const exceptionNewRepeatPasswordsNoMatch = (label: string) =>
  `newPassword and ${label} do not match.`;
