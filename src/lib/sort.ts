// management_numberの共通昇順ソート

export type HasManagementNumber = {
  management_number: string;
};

export function compareByManagementNumber(a: HasManagementNumber, b: HasManagementNumber): number {
  return a.management_number.localeCompare(b.management_number, 'ja', { numeric: true });
}


