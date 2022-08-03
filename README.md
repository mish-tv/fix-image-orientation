<h1 align="center">@mish-tv/fix-image-orientation</h1>

<div align="center">
<a href="https://www.npmjs.com/package/@mish-tv/fix-image-orientation"><img src="https://img.shields.io/npm/v/@mish-tv/fix-image-orientation.svg" alt="npm"></a>
<a href="https://github.com/mish-tv/fix-image-orientation/actions/workflows/build-and-test.yml"><img src="https://github.com/mish-tv/fix-image-orientation/actions/workflows/build-and-test.yml/badge.svg" alt="Build and test"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/mish-tv/fix-image-orientation.svg?style=flat" alt="license"></a>
</div>

<h4 align="center">
When this function receives a Blob of an image file as an argument, it returns the dataURL with orientation applied and exif removed.
</h4>

## Features

- Zero Dependency
- Lightweight

## Usage

```html
<input id="file" type="file" />
<img id="preview" />

<script>
  const preview = document.getElementById("preview");
  const input = document.getElementById("file");

  input.addEventListener("change", (event) => {
    const file = event.target.files[0];

    imageFileToOrientationFixedDataURL(file).then((url) => {
      preview.src = url; // data:image/png;base64,iVBORw0K...
    });
  });
</script>
```

## Supported Format

- jpeg
- png

If an unsupported format is received, it returns dataURL without processing.

## Installation

```
npm install --save @mish-tv/fix-image-orientation
```
