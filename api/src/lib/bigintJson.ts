// Bill.billNumber is a BigInt (Prisma maps it that way for large integer IDs),
// and JSON.stringify throws on BigInt by default. Teaching every response
// serializer about that is more error-prone than fixing it once, here.
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export {};
