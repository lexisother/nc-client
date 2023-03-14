// Hack required because TS keeps complaining about these not being importable.
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
