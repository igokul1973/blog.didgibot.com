const o1 = { a: 1, b: { k: [200, 'hello', { d: false }] } };
const o2 = { a: 1, b: { k: [200, 'hello', { d: false }] } };
const jsonO1 = JSON.stringify(o1);
const jsonO2 = JSON.stringify(o2);

const m1 = new Map();
m1.set(jsonO1, { a: 1 });
m1.set(jsonO2, { a: 2 });
m1.set(jsonO1, { a: 3 });

console.log(m1);
