const fs = require("fs");
const path = require("path");
const midiFileParser = require("midi-file-parser");
const MIDIUtils = require("midiutils");

const inputDir = path.join(__dirname, "input");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const files = fs.readdirSync(inputDir).filter((file) => file.endsWith(".mid"));

files.forEach((file) => {
  const midiData = fs.readFileSync(path.join(inputDir, file), "binary");
  const midi = midiFileParser(midiData);

  const notes = [];
  let noteStatus = false;
  const track = 0;

  for (let i = 0; i < midi.tracks[track].length; i++) {
    const currentObject = midi.tracks[track][i];
    switch (currentObject.subtype) {
      case "noteOn":
        if (!noteStatus) {
          notes.push([
            MIDIUtils.noteNumberToFrequency(currentObject.noteNumber),
            0,
          ]);
          noteStatus = true;
        }
        break;
      case "noteOff":
        if (
          noteStatus &&
          MIDIUtils.noteNumberToFrequency(currentObject.noteNumber) ===
            notes[notes.length - 1][0]
        ) {
          notes[notes.length - 1][1] = currentObject.deltaTime;
          noteStatus = false;
        }
        break;
    }
  }

  // groups notes into sets of 4
  const noteGroups = [];
  for (let i = 0; i < notes.length; i += 4) {
    let group = notes.slice(i, i + 4);
    while (group.length < 4) {
      group.push([440, 124]); // default note, that fills the last gaps
    }
    noteGroups.push(group);
  }

  // Generate output for all groups
  const outputs = noteGroups
    .map(
      (group, index) => `const Note tone${index + 1}[] = {
    {${group[0][0].toFixed(2)}, ${group[0][1]}},
    {${group[1][0].toFixed(2)}, ${group[1][1]}},
    {${group[2][0].toFixed(2)}, ${group[2][1]}},
    {${group[3][0].toFixed(2)}, ${group[3][1]}}
};`
    )
    .join("\n\n");

  // Save to output file
  const outputFile = path.join(outputDir, `${path.parse(file).name}.h`);
  fs.writeFileSync(outputFile, outputs);
});
