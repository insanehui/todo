/*
 * 判断当前运行环境是development还是production
 * 目前这个变量是create-react-app通过webpack注入进去的
 */
const env = process.env.NODE_ENV

export const isDev = env === 'development'
