
//acfco = ansi codes for coloured output.
const acfco = `
Colors	        FG    BG    CODE
Black           30    40    \\x1b[{num}m
Red             31    41    same
Green           32    42    same
Yellow          33    43    same
Blue            34    44    same
Magenta         35    45    same
Cyan            36    46    same
White           37    47    same
Bright-Black    90    100   same
Bright-Red      91    101   same
Bright-Green    92    102   same
Bright-Yellow   93    103   same
Bright-Blue     94    104   same
Bright-Magenta  95    105   same
Bright-Cyan     96    106   same
Bright-White    97    107   same
Bold            -     -     \\x1b[1m
Dim/Faint       -     -     \\x1b[2m
Italic          -     -     \\x1b[3m
Underlined      -     -     \\x1b[4m
Blinking        -     -     \\x1b[5m
Inverse         -     -     \\x1b[7m
Hidden          -     -     \\x1b[8m
Strike-through  -     -     \\x1b[9m
Default         39    49    \\x1b[{FG/BG}m
Reset           0     0     \\x1b[0m
`;

export default acfco;