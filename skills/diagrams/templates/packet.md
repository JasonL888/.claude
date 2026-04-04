# packet-beta — Network Packet Structure

```
packet-beta
  0-7: "Version"
  8-15: "IHL"
  16-31: "Total Length"
  32-63: "Identification"
  64-79: "Flags + Fragment Offset"
  80-95: "TTL + Protocol"
  96-127: "Header Checksum"
  128-159: "Source IP"
  160-191: "Destination IP"
```

Format: `start-end: "Field Name"`. Bit ranges are inclusive. No `%%{init}%%` support.
