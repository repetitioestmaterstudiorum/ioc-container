/* Utility type to generate object keys recursively. 
Source: https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3 and then https://gist.github.com/pffigueiredo/9161240b8c09d51ea448fd43de4d8bbc

Alternative with depth limit: https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object */

// prettier-ignore
export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		// @ts-ignore
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`
}[keyof ObjectType & (string | number)]
