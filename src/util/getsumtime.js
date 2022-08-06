function myFunction(myArray) {
  let sum = 0;
  for (let i of myArray) {
    sum += i.sumwork;
  }
  return sum;
}

module.exports = myFunction;
