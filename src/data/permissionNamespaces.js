const permissionNamespaces = {
  rescues: {
    icon: 'first-aid',
    text: 'rescues',
    actionText: {
      write: {
        all: 'Create, modify, and delete',
        self: 'Modify',
      },
    },
  },
  rats: {
    icon: 'mouse',
    text: 'rats',
    actionText: {
      write: {
        all: 'Create, modify, and delete',
        self: 'Create, modify, and delete',
      },
    },
  },
  users: {
    icon: 'user',
    text: 'user account',
    selfSingular: true,
    actionText: {
      write: {
        all: 'Modify and delete',
        self: 'Modify',
      },
    },
  },
  nicknames: {
    icon: 'signature',
    text: 'nicknames',
    actionText: {
      write: {
        all: 'Create, modify, and delete',
        self: 'Create, modify, and delete',
      },
    },
  },
  clients: {
    icon: 'shield-alt',
    text: 'OAuth clients',
    actionText: {
      write: {
        all: 'Create, modify, and delete',
        self: 'Create, modify, and delete',
      },
    },
  },
  ships: {
    icon: 'rocket',
    text: 'ships',
    actionText: {
      write: {
        all: 'Create, modify, and delete',
        self: 'Create, modify, and delete',
      },
    },
  },
}





export default permissionNamespaces
