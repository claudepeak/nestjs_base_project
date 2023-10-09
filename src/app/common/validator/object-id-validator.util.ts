// object-id-validator.util.ts

export function isValidObjectId(id: string): boolean {
  /*   const validHexLength = 24;
  return (
    typeof id === 'string' &&
    id.length === validHexLength &&
    /^[0-9a-fA-F]+$/.test(id)
  ); */

  // UUID formatı genellikle 8-4-4-4-12 karakter uzunluğunda onaltılık gruplardan oluşur
  // Örnek: 550e8400-e29b-41d4-a716-446655440000
  const specialPattern = /^[a-z0-9]+$/;
  return specialPattern.test(id);
}
