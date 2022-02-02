# Sneck
![Sneck OpenGraph image](docs/images/sneck_og.svg)

_Snake simulator_

## Controls
- ``WASD`` to set move direction
- ``<Hold> WASD`` to move faster
- You can also move by dragging the playfield with mouse (or your finger if you are using touchscreen)

## Gameplay
> Scoring system only available in singleplayer mode

- Orange object: Generic scoring object (``+1`` per object)
- Blue object: Allow you to go over your body (``+2`` per object)
- Green object: Slice your tail by 5 tiles (``+3`` per object)

## Building
Sneck uses ESBuild for insane build time (man I wish I heard about ESBuild sooner)

```sh
./node_modules/.bin/esbuild src/index.ts --bundle --minify --sourcemap --outfile=html/bundle.js
```

You can also run ``./build`` (which basically the command above but as a script file)
