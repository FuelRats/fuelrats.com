# CSS classes in JSX


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [String syntax](#string-syntax)
- [Array Syntax](#array-syntax)
- [Object Syntax](#object-syntax)
- [Best Practices](#best-practices)
  - [Class Order](#class-order)
  - [Strings in arrays](#strings-in-arrays)
  - [Complexity](#complexity)
- [Limitations](#limitations)
  - [Variables](#variables)
  - [Duplicates](#duplicates)
- [Further Reading](#further-reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Introduction

In React, CSS classes are set by passing a string to the `className` prop.
On `fuelrats.com`, we have expanded this functionality to accept Object and Array expressions.

**IMPORTANT:** Be aware of the limitations of this feature, which are detailed [below](#limitations).

## String syntax

`className` can be a string just like `class` in normal HTML

```jsx
<div className="foo" />
```

You can also pass in a string variable like so:

```jsx
const {
  className
} = props

<div className={className} />
```

## Array Syntax

`className` accepts an array of classes to apply:

```jsx
const {
  className // = 'bar'
} = props

<div className={['foo', className]} />


// Would render:
<div class="foo bar" />
```

Nested arrays will be concatenated:

```jsx
<div className={['foo', ['bar', ['baz']]]} />


// Would render:
<div class="foo bar baz" />
```

falsy values are ignored:

```jsx
const {
  className // = undefined
} = props
<div className={['foo', null, 'bar', false, '', className]} />


// Would render:
<div class="foo bar" />
```

## Object Syntax

`className` accepts an object for dynamic control of classes.

In objects, property keys represent the classes to apply, and the value determines if that class is applied to the element.

```jsx
const {
  foo, // = true
} = props

<div className={{'is-foo': foo, 'is-bar': true, 'is-baz': false }} />


// Would render:
<div class="is-foo is-bar" />
```

Objects can be used in arrays:

```jsx
const {
  bar, // = true
} = props

<div className={['foo', { 'is-bar': bar }]}>


// Would render:
<div class="foo is-bar" />

```

Object names can be dynamic

```jsx
const {
  applyClasses, // = true
} = state

const {
  className, // = 'bar'
} = props

<div className={['foo', { [className]: applyClasses }]}>


// Would render:
<div class="foo bar">
```

## Best Practices

### Class Order

In almost all cases, `className` should follow the order of:
* `static`
* `CSSModule static`
* `dynamic with static name`
* `dynamic with dynamic name`
* `className` prop

```jsx
import styles from './style.module.css'

const {
  className,
  isQux,
  isQuux,
} = props

<div
  className={
    [
      'foo bar',
      styles.baz,
      {
        'qux': isQux,
        [styles.quux]: isQuux,
      },
      className,
    ]
  } />
```

### Strings in arrays

Avoid arrays which contain multiple string expressions. This is to optimize runtime calculation.

```jsx
// Wrong!
<div className={['foo', 'bar', className]} />


// Thats better 😎
<div className={['foo bar', className]} />
```

### Complexity

Avoid overly complex class definitions. Prefer using CSSModule's `composes` property when using css modules, and don't use too many dynamic tags.

**DONT**

```jsx
<div className={['button green compact', styles.submitButton]} />
```

**DO**

```css
.button {
  composes: button from global;
  composes: green from global;
  composes: compact from global;

  /* other styles you need to apply */
}
```

```jsx
import styles from './styles.module.css'

// Much better!
<div className={styles.submitButton} />
```

## Limitations

### Variables

Due to limitations in how we transform `className` at build time, variables directly passed to `className` **MUST** be strings.

```jsx
// Works
const styles = "foo"
<div className={styles} />


// Doesn't work!
const styles = ['foo']
<div className={styles} />


// Doesn't work!
const styles = { foo: true }
<div className={styles} />
```

To get around this you can pass the variable into an array:

```jsx
const styles = { foo: true }
<div className={[styles]}>

// Would render:
<div class="foo" />
```

### Duplicates

`className` will not dedupe classes applied to an element as it's significantly slower to calculate.

```jsx
const {
  className // = "baz"
} = props
<div className={['foo', 'bar', 'bar', 'baz', className]}>

// Would render:
<div class="foo bar bar baz baz" />
```

## Further Reading

Under the hood we use a modified version of the [`babel-plugin-classnames`][bpcn] library which supports object expressions as a `className` value on top of it's default behavior.

This transform plugin wraps objects and arrays passed to `className` with the [`classnames`][classnames] library. If you would like to learn more about the syntax of classNames,
visit [the `classnames` repo][classnames].




[bpcn]: https://github.com/giuseppeg/babel-plugin-classnames
[classnames]: https://github.com/JedWatson/classnames
