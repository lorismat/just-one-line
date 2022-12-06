# just-one-line

```sh
npm run dev -- --host
```  

**preview** . 
```sh
npm run build && surge dist/ -d just-one-line.surge.sh
```

## Config

- `vercel.json` requires for proper routing and link sharing on **vercel**

# Playing with

- thickness
- position
- background color
- foreground color
- number of lines
- smoothness
- time distortion
- noise impact on axis (x, y, xy)
- position sign
- clipPath on some lines with doubleCircleSeat function

- distortion level
  - power of noise (will lead to stain and broken line)
  - post noise multiplicator (will increase the amplitude)
  - level of cumulation of the previous two (adding extra noise)
  - applying functions to the noise