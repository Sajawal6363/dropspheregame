if (!Array.prototype.toReversed) {
  Object.defineProperty(Array.prototype, "toReversed", {
    value: function toReversed() {
      return [...this].reverse();
    },
    writable: true,
    configurable: true,
  });
}

if (!Array.prototype.toSorted) {
  Object.defineProperty(Array.prototype, "toSorted", {
    value: function toSorted(compareFn) {
      return [...this].sort(compareFn);
    },
    writable: true,
    configurable: true,
  });
}

if (!Array.prototype.toSpliced) {
  Object.defineProperty(Array.prototype, "toSpliced", {
    value: function toSpliced(start, deleteCount, ...items) {
      const next = [...this];
      next.splice(start, deleteCount, ...items);
      return next;
    },
    writable: true,
    configurable: true,
  });
}
