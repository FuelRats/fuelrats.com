module.exports = {
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'order/order': [
      {
        // Selects @include
        type: 'at-rule',
        name: 'include',
      },
      {
        // Selects @extends
        type: 'at-rule',
        name: 'extend',
      },
      'custom-properties',
      'at-variables',
      'declarations',
      {
        // Selects rules beginning with '&'
        type: 'rule',
        selector: /^&/u,
      },
      'rules',
      'at-rules',
      'less-mixins',
    ],
    'order/properties-alphabetical-order': null,
    'order/properties-order': [
      [
        {
          groupName: 'layout',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'appearance', 'display', 'position', 'float', 'clear', 'top', 'right', 'bottom', 'left', 'z-index',
          ],
        },
        {
          groupName: 'flexbox-grid-parent',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',
          properties: [
            'flex-flow', 'flex-direction', 'flex-wrap',
            'grid',
            'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
            'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
            'grid-gap', 'grid-column-gap', 'grid-row-gap',
            'place-items', 'align-items', 'justify-items',
            'place-content', 'align-content', 'justify-content',
          ],
        },
        {
          groupName: 'flexbox-grid-child',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',
          properties: [
            'order',
            'flex', 'flex-grow', 'flex-shrink', 'flex-basis',
            'grid-area', 'grid-column', 'grid-column-start', 'grid-column-end',
            'grid-row', 'grid-row-start', 'grid-row-end',
            'place-self', 'align-self', 'justify-self',
          ],
        },
        {
          groupName: 'box-model',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'content',
            'min-width', 'width', 'max-width',
            'min-height', 'height', 'max-height',
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
          ],
        },
        {
          groupName: 'border',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'border', 'border-width', 'border-style', 'border-color',
            'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
            'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
            'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
            'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
            'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
            'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width',
          ],
        },
        {
          groupName: 'visual',

          // By default, the properties in this group must come in the order specified. If 'flexible', the properties can be in any order as long as they are grouped correctly.
          order: 'flexible',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'color',
            'background', 'background-attachment', 'background-clip', 'background-color', 'background-image', 'background-origin',
            'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'background-size',
            'box-shadow', 'opacity', 'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'transition',
          ],
        },
        {
          groupName: 'typographical',

          // By default, the properties in this group must come in the order specified. If 'flexible', the properties can be in any order as long as they are grouped correctly.
          order: 'flexible',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'font', 'font-display', 'font-style', 'font-size', 'font-weight', 'font-family', 'font-variant',
            'text-align', 'text-decoration', 'text-transform', 'text-shadow', 'line-height',
            'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'white-space',
          ],
        },
        {
          groupName: 'misc',

          // By default, the properties in this group must come in the order specified. If 'flexible', the properties can be in any order as long as they are grouped correctly.
          order: 'flexible',

          // If always, this group must be separated from other properties by an empty newline.
          emptyLineBefore: 'threshold',

          // If true, properties within group should not have empty lines between them.
          noEmptyLineBetween: true,
          properties: [
            'cursor', 'overflow', 'overflow-x', 'overflow-y', 'overflow-wrap', 'transform',
          ],
        },
      ],
      {
        // Specify where otherwise unspecified properties can appear: top, bottom, ignore (no rules applied)
        unspecified: 'ignore',

        // I can't even come up with a single sentance to explain this.
        // https://github.com/hudochenkov/stylelint-order/tree/master/rules/properties-order#emptylineminimumpropertythreshold
        emptyLineMinimumPropertyThreshold: 2,
      },
    ],
  },
}
