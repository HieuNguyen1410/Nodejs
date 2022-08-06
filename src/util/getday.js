const diffDays = (date, otherDate) => {
  return Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
};
function splitTime(numberOfHours){
  var Days=Math.floor(numberOfHours/24);
  var Remainder=numberOfHours % 24;
  var Hours=Math.floor(Remainder);
  var Minutes=Math.floor(60*(Remainder-Hours));
  return({"Days":Days,"Hours":Hours,"Minutes":Minutes})
}
module.exports = {diffDays,splitTime};
