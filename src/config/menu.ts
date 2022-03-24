export interface IMenu {
  title: string;
  path: string;
  icon: string;
}
const menuList: IMenu[] = [
  {
    title: '首页',
    path: '/home',
    icon: 'home'
  },
  {
    title: '测试',
    path: '/test',
    icon: 'key'
  }
];

export default menuList;
