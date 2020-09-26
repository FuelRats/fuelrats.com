# Using Stripe Bans File


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [File structure & How to ban someone.](#file-structure--how-to-ban-someone)
- [Technical details](#technical-details)
- [Ban system TODO](#ban-system-todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Introduction

The Stripe Bans file restricts IP addresses from creating stripe checkout sessions.

To use it, create a JSON file anywhere on your file system (that the webserver user can read), and point to it using the ENV variable `FRDC_STRIPE_BANS_FILE`.
If the variable is not defined, the webserver will not restrict access.

## File structure & How to ban someone.

To keep things simple we keep separate tables on `IPv4` and `IPv6` addresses banned from using the donation API.

The request's IP can be compared to a subnet by specifying a prefix length. e.g. "`/24`"

IPv4s must be full

**BY DEFAULT**
* All IPv4 addresses are treated as exact match comparisons.
* All IPv6 addresses will be given a prefix length of "`/56`", but can be overidden by including the length in the IP.

```json
{
  "ipv4": [
    '127.0.0.1', // Ban 127.0.0.1
    '192.168.13.37', // Ban 192.168.13.37
    '255.255.255.0/24' // Ban all addresses that begin with "255.255.255"
    '0.0.0.0/0' // This bans all IPv4 addresses. 😎
  ],
  "ipv6": [
    '1234:5678:90ab:cdef:fedc:ab09:8765:4321', // ban all addresses that begin with 1234:5678:90ab:cd (notice lack of prefix length)
    '1234:5678:90ab:cdef::/56', // ban all addresses that begin with "1234:5678:90ab:cd".
    '1234:5678:90ab:cdef::/64', // ban all addresses that begin with "1234:5678:90ab:cdef".

  ]
}
```

**REMINDER:**

Each block in a IPv6 address should be read right-to-left to avoid pitfalls.
For example: `1234:5678:90ab:cd::` is understood as `1234:5678:90ab:00cd::` and **NOT** `1234:5678:90ab:cd00::`. To avoid this possible confusion, don't shorten blocks!

## Technical details

The donation API's ban system uses [node-ip6addr](https://github.com/joyent/node-ip6addr#func-compareaddr) to make IP comparisons.
We determine if someone is banned with a comparison thats roughly the same as:

```javascript
  ip6addr.createCIDR(processedComparisonIP).contains(requestIP)
```

`processedComparisonIP` being each ip of the given `requestIP` kind (`v4` or `v6`), which has been processed to include prefix length where there is none.




## Ban system TODO

* Create admin panel (backed by FR API permission scopes) which gives management options of the ban list.
    * Once this is done, manual creation of the file will no longer be required. Only the location will need to be specified.
