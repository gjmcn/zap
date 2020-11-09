## Interpolate {#interpolate}

---

`interpolate` linearly interpolates between its first two operands. The third operand is the interpolation parameter: 

```
5 9 interpolate 0         // 5
5 9 interpolate 1         // 9
5 9 interpolate 0.5       // 7
5 9 interpolate (3 / 8)   // 6.5
5 9 interpolate 1.5       // 11
5 9 interpolate (-0.5)    // 3

20 10 interpolate 0.7     // 13

// interpolate multiple values
@ 0.2 0.6 0.9 map x (10 20 interpolate x)   // [12, 16, 19]
```

`interpolate` treats all operands as numbers.