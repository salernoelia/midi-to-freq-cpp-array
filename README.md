# MIDI to Frequency Converter

Converts MIDI files into C++ compatible frequency arrays, splitting notes into groups of 4 tones with their respective durations. The original usecase was to automate the sound-design to microcontroller process for esp32.

## Installation

Quickstart

```sh
git clone https://github.com/salernoelia/midi-to-freq-cpp-array
cd midi-to-freq

Install dependencies
npm install
```

# Usage

1. Place MIDI files in input directory
2. Run the converter:

```sh
node index.js
```

3. Find generated .h files in output directory

# Output Example

Input: song.mid → Output: song.h

```cpp
const Note tone1[] = {
    {329.63, 119},
    {587.33, 119},
    {493.88, 119},
    {392.00, 119}
};

const Note tone2[] = {
    {440.00, 124},
    {523.25, 124},
    {659.26, 124},
    {783.99, 124}
};
```
