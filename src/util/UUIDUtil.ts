/**
 *
 * @param len:string       生成UUI的字符串的长度    默认为16字符
 * @param radix:string     生成UUID的字符串的进制   默认为16进制
 * @return {string}        返回生成的UUID字符串
 * @constructor
 */
const randomNumInt = (num = 16) => {
  const number = (num * Math.random()).toString();
  return '' + parseInt(number, 16).toString(num);
};
export const GenerateUUID = (radix = 16) => {
  // 防止出现数字开头 tmg 2018-04-26
  let uuid = 'F';
  let i: number;
  // 4位前缀随机数
  for (i = 0; i < 4; i++) uuid += randomNumInt(radix);
  // 日期时间(16进制)
  uuid += new Date().getTime().toString(radix);
  // 4位后缀随机数
  for (i = 0; i < 4; i++) uuid += randomNumInt(radix);

  return uuid.toUpperCase();
};
