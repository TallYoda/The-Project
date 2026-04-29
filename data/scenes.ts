export type SceneKey = "scene1" | "scene2" | "scene3" | "scene4" | "scene5" | "scene6";

export type SceneState = {
  camera: {
    x: number;
    y: number;
    z: number;
    scale: number;
    xOffset?: number;
    yOffset?: number;
  };
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    vignette: number;
    blur: number;
    colorShift: number;
  };
  animation: {
    breathingIntensity: number;
    breathingSpeed: number;
    driftX: number;
    driftY: number;
    driftSpeed: number;
    pulse: number;
  };
  transition: {
    duration: number;
    ease: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  };
  automation: {
    autoColorShift: boolean;
    autoColorShiftSpeed: number;
  };
};

export const sceneKeys: SceneKey[] = ["scene1", "scene2", "scene3", "scene4", "scene5", "scene6"];

export const scenesByPainting: Record<string, Partial<Record<SceneKey, SceneState>>> = {
  "storytime": {
    "scene1": {
      "camera": {
        "x": 0.01,
        "y": -0.03,
        "z": 2.51,
        "scale": 1.01,
        "xOffset": -0.37,
        "yOffset": 0.03
      },
      "effects": {
        "brightness": 0.81,
        "contrast": 1,
        "saturation": 0.96,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": -14
      },
      "animation": {
        "breathingIntensity": 0.009,
        "breathingSpeed": 1.2,
        "driftX": 0.022,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.009
      },
      "transition": {
        "duration": 3490,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene2": {
      "camera": {
        "x": 0.08,
        "y": -0.42,
        "z": 4.04,
        "scale": 2,
        "xOffset": -0.33,
        "yOffset": -1
      },
      "effects": {
        "brightness": 0.83,
        "contrast": 1,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 1
      },
      "animation": {
        "breathingIntensity": 0.009,
        "breathingSpeed": 1.54,
        "driftX": 0,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.01
      },
      "transition": {
        "duration": 3690,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene3": {
      "camera": {
        "x": 0.08,
        "y": 0,
        "z": 5.1,
        "scale": 2,
        "xOffset": 0,
        "yOffset": -1.5
      },
      "effects": {
        "brightness": 0.23,
        "contrast": 1.06,
        "saturation": 1.52,
        "vignette": 0.47,
        "blur": 0.05,
        "colorShift": 9
      },
      "animation": {
        "breathingIntensity": 0.027,
        "breathingSpeed": 0.74,
        "driftX": 0.033,
        "driftY": -0.035,
        "driftSpeed": 0.4,
        "pulse": 0.01
      },
      "transition": {
        "duration": 14500,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": true,
        "autoColorShiftSpeed": 100
      }
    },
    "scene4": {
      "camera": {
        "x": -0.01,
        "y": 0.18,
        "z": 4.81,
        "scale": 1.36,
        "xOffset": -0.1,
        "yOffset": -0.33
      },
      "effects": {
        "brightness": 1,
        "contrast": 1,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0.027,
        "breathingSpeed": 0.66,
        "driftX": 0.019,
        "driftY": 0.017,
        "driftSpeed": 0.4,
        "pulse": 0.022
      },
      "transition": {
        "duration": 10170,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene5": {
      "camera": {
        "x": -0.01,
        "y": 0.64,
        "z": 3.24,
        "scale": 0.84
      },
      "effects": {
        "brightness": 0.08,
        "contrast": 1,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0.013,
        "breathingSpeed": 0.66,
        "driftX": 0,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.022
      },
      "transition": {
        "duration": 3000,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene6": {
      "camera": {
        "x": -0.01,
        "y": 0,
        "z": 1.27,
        "scale": 0.76
      },
      "effects": {
        "brightness": 1,
        "contrast": 1.14,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0,
        "breathingSpeed": 1.2,
        "driftX": 0,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0
      },
      "transition": {
        "duration": 900,
        "ease": "ease-in-out"
      }
    }
  },
  "cocaine": {
    "scene1": {
      "camera": {
        "x": -0.01,
        "y": 0,
        "z": 1.97,
        "scale": 1.24,
        "xOffset": -0.38,
        "yOffset": 0
      },
      "effects": {
        "brightness": 1.06,
        "contrast": 1.05,
        "saturation": 0.92,
        "vignette": 0.38,
        "blur": 0.31,
        "colorShift": -1
      },
      "animation": {
        "breathingIntensity": 0.036,
        "breathingSpeed": 0.51,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.01
      },
      "transition": {
        "duration": 11230,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene2": {
      "camera": {
        "x": -0.01,
        "y": -0.38,
        "z": 4.02,
        "scale": 1.51,
        "xOffset": 0,
        "yOffset": -0.5
      },
      "effects": {
        "brightness": 1.06,
        "contrast": 1.15,
        "saturation": 1.1,
        "vignette": 0.38,
        "blur": 0,
        "colorShift": 3
      },
      "animation": {
        "breathingIntensity": 0.042,
        "breathingSpeed": 2.27,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.028
      },
      "transition": {
        "duration": 1840,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 116
      }
    },
    "scene3": {
      "camera": {
        "x": 0.64,
        "y": 1,
        "z": 4.55,
        "scale": 1.85,
        "xOffset": 0.57,
        "yOffset": 0.62
      },
      "effects": {
        "brightness": 1.18,
        "contrast": 1.11,
        "saturation": 0.99,
        "vignette": 0.38,
        "blur": 0,
        "colorShift": 1
      },
      "animation": {
        "breathingIntensity": 0.036,
        "breathingSpeed": 2.27,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 900,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 57
      }
    },
    "scene4": {
      "camera": {
        "x": 0.15,
        "y": 0.02,
        "z": 2.13,
        "scale": 0.58
      },
      "effects": {
        "brightness": 1.04,
        "contrast": 1.05,
        "saturation": 0.99,
        "vignette": 0.38,
        "blur": 0,
        "colorShift": 10
      },
      "animation": {
        "breathingIntensity": 0.036,
        "breathingSpeed": 1.07,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 2350,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 30
      }
    },
    "scene5": {
      "camera": {
        "x": -0.01,
        "y": -0.18,
        "z": 3.81,
        "scale": 1.36,
        "xOffset": 0,
        "yOffset": -0.31
      },
      "effects": {
        "brightness": 0.98,
        "contrast": 1,
        "saturation": 1.06,
        "vignette": 0.38,
        "blur": 0,
        "colorShift": -9
      },
      "animation": {
        "breathingIntensity": 0.036,
        "breathingSpeed": 3.39,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.001
      },
      "transition": {
        "duration": 2360,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": true,
        "autoColorShiftSpeed": 135
      }
    },
    "scene6": {
      "camera": {
        "x": -0.01,
        "y": 0.16,
        "z": 3.73,
        "scale": 1.89,
        "xOffset": 0,
        "yOffset": -1.01
      },
      "effects": {
        "brightness": 0.98,
        "contrast": 1,
        "saturation": 1.06,
        "vignette": 0.38,
        "blur": 0,
        "colorShift": -9
      },
      "animation": {
        "breathingIntensity": 0.036,
        "breathingSpeed": 3.39,
        "driftX": -0.013,
        "driftY": 0,
        "driftSpeed": 0.4,
        "pulse": 0.001
      },
      "transition": {
        "duration": 2360,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 135
      }
    }
  },
  "egodeath": {
    "scene1": {
      "camera": {
        "x": -0.01,
        "y": 0,
        "z": 3.18,
        "scale": 1.08,
        "xOffset": -0.26,
        "yOffset": 0
      },
      "effects": {
        "brightness": 1,
        "contrast": 1.25,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0.004,
        "breathingSpeed": 1.2,
        "driftX": 0.02,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 14100,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 181
      }
    },
    "scene2": {
      "camera": {
        "x": -0.01,
        "y": -0.25,
        "z": 3.02,
        "scale": 1.32,
        "xOffset": 0,
        "yOffset": 0.24
      },
      "effects": {
        "brightness": 1,
        "contrast": 1,
        "saturation": 1.22,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0.031,
        "breathingSpeed": 2.74,
        "driftX": 0.04,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 12170,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": true,
        "autoColorShiftSpeed": 45
      }
    },
    "scene3": {
      "camera": {
        "x": 0.56,
        "y": -0.23,
        "z": 3.02,
        "scale": 0.84
      },
      "effects": {
        "brightness": 1,
        "contrast": 1,
        "saturation": 1.22,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 0
      },
      "animation": {
        "breathingIntensity": 0.016,
        "breathingSpeed": 2.12,
        "driftX": 0.02,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 2140,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": true,
        "autoColorShiftSpeed": 142
      }
    },
    "scene4": {
      "camera": {
        "x": -0.01,
        "y": -0.86,
        "z": 3.4,
        "scale": 1.09,
        "xOffset": 0,
        "yOffset": 0
      },
      "effects": {
        "brightness": 1,
        "contrast": 1.18,
        "saturation": 1.36,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": -9
      },
      "animation": {
        "breathingIntensity": 0.011,
        "breathingSpeed": 1.2,
        "driftX": 0.02,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.016
      },
      "transition": {
        "duration": 15440,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 181
      }
    },
    "scene5": {
      "camera": {
        "x": -0.27,
        "y": -0.34,
        "z": 4.73,
        "scale": 1.88,
        "xOffset": -0.92,
        "yOffset": -0.43
      },
      "effects": {
        "brightness": 1,
        "contrast": 1.14,
        "saturation": 1,
        "vignette": 0.55,
        "blur": 0,
        "colorShift": 2
      },
      "animation": {
        "breathingIntensity": 0.018,
        "breathingSpeed": 1.2,
        "driftX": 0.033,
        "driftY": 0.029,
        "driftSpeed": 0.4,
        "pulse": 0.022
      },
      "transition": {
        "duration": 2450,
        "ease": "ease-in-out"
      },
      "automation": {
        "autoColorShift": false,
        "autoColorShiftSpeed": 177
      }
    }
  }
};
