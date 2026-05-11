export type DialogueChoice = {
  text: string;
  next: string | null;
  effect?: string;
};

export type DialogueNode = {
  text: string;
  choices: DialogueChoice[];
};

export type DialogueTree = Record<string, DialogueNode>;

export const dialogues: Record<string, DialogueTree> = {
  storytime: {
    start: {
      text: "You start like everyone else, as a child. You're being read a story, you're comfy, tucked in, and ready to embark on one last journey before calling it a night.",
      choices: [
        {
          text: "Listen to the Story",
          next: "listen_story",
          effect: "scene2",
        },
        {
          text: "Listen to the Voice",
          next: "listen_voice",
          effect: "scene4",
        },
      ],
    },
    listen_story: {
      text: "You don't know it yet, but this is your first exercise in empathy, the practice of listening and stepping into someone else's shoes. Much later you'll understand the weight and importance of what's going on, but for now only curiosity and immersion matter. The flow and the conflict of the tale has got you all wired up. There's no way you're falling asleep without reaching resolution, but the gentle breathing of your sibling reminds you that it's going to be bedtime in a few moments.",
      choices: [
        {
          text: "Beg for one more chapter",
          next: "story_end",
          effect: "scene3",
        },
      ],
    },
    listen_voice: {
      text: "You let the baritone voice of your reader drown out the words and meaning; this is peak ASMR, so easy to fall asleep to. You'll one day get older and actually start understanding what's exactly at stake with these stories, but today is not that day.",
      choices: [
        {
          text: "Next Chapter",
          next: "load:cocaine",
          effect: "scene6",
        },
      ],
    },
    story_end: {
      text: "Your request is gently denied. Looks like it's lights out for you. You get a second lesson that wasn't delivered through the story: sometimes you have no choice but to wait. In the darkness your imagination flips through foreign possibilities for the story and for yourself. Your mind eventually settles into the unknowable machinations of deep sleep.",
      choices: [{ text: "Next Chapter", next: "load:cocaine", effect: "scene5" }],
    },
  },
  cocaine: {
    start: {
      text: "You were always terrified of dogs. It was never because of some specific mishap; you just always felt something off with those animals. You never had one growing up at home, and you never saw the appeal. You could never read them, and you assumed they felt the same. So you generally avoided them, and your avoidance has been rewarded with a body that's bite-free. One night, walking home after sinking a few with friends, you see a white mutt stray walking towards you. It wasn't even looking at the dog-loving, stray-petting gang of drunks around you; it was staring right at you.",
      choices: [
        {
          text: "Heed your instincts",
          next: "instinct",
          effect: "scene2",
        },
        {
          text: "Heed the other voice",
          next: "other_voice",
          effect: "scene5",
        },
      ],
    },
    instinct: {
      text: "Years of avoiding these animals has carved deep grooves in your mind to let fear flow like an entire river system. The cortisol drowns out the liquid courage, and you start to figure out how to not participate in this tryst. Your friends, however, have a completely different idea: they all just tell you to 'pet' it. Your pleas fall on deaf ears. They resort to force, and you're dragged by your limbs and clothes towards the dog.",
      choices: [
        {
          text: "You're too scared, dissociate",
          next: "dissociate",
          effect: "scene2",
        },
      ],
    },
    other_voice: {
      text: "There is one force in this world that influences the workings of people in queer ways. It's ubiquitous, ancient, and powerful. The alcohol in your system taps into this foreign power: it makes you brave, adventurous, and washes away your inhibitions. Faced with this potent elixir, your fear is afraid.",
      choices: [
        {
          text: "Pet the damn dog",
          next: "pet_dog",
          effect: "scene5",
        },
      ],
    },
    dissociate: {
      text: "Your friends present you to this dog like a sacrificial animal. The disconnect between your body and mind makes you feel like a puppet. You close your eyes as they puppeteer your body and extend your hands to its head. The foreign texture on your sweaty palms flips the dissociation switch back; it's soft and warm and inviting. You open your eyes to see a dog leaning into your touch with its eyes closed. They let go of your hands, but you don't let go of the dog.",
      choices: [
        {
          text: "Give the dog a name",
          next: "name_dog",
          effect: "scene3",
        },
      ],
    },
    pet_dog: {
      text: "With pure courage flowing in you, you drown out all the protest within and decide to connect with this animal. You go for a first touch, but decide otherwise and pick the whole damn dog up. Your friends voice their surprise and then protest. They claim you're not acting by stray engagement etiquette and tell you to put it down. You will not let them put guard rails around this newfound love. You declare you've named him 'Cocaine' on account of his white fur and start walking home. A great wall has fallen today and you're now a changed person.",
      choices: [{ text: "Internalize the lesson from this encounter", next: "lesson", effect: "scene6" }],
    },
    name_dog: {
      text: "Maybe this dog has a name already. The stench of the stray betrays this beast had never seen a home, and hence has never had a name. What you've felt tonight you've only felt a couple times before: joy, a little regret, and a desire to connect deeply to another being. You name him Cocaine. Your friends laugh and agree to the name; they ask if it's because of his white fur. You lie and say yes.",
      choices: [{ text: "Next Chapter", next: "load:egodeath", effect: "scene4" }],
    },
    lesson: {
      text: "You take this dog home and let it stay for the night before sobriety comes back holding context and reason. Luckily, you didn't take it too far from where you found it. You feed it, apologize, and find you're unbothered as it follows you to the vicinity of where you found it. It's a smart dog; it doesn't try to follow you back as you leave. It's often a dog-eat-dog world, but not all the time. That's your lesson here.",
      choices: [{ text: "Next Chapter", next: "load:egodeath", effect: "scene4" }],
    },
  },
  egodeath: {
    start: {
      text: "They say ego death is the highest spiritual goal a human can aspire to: the complete loss of subjective self-identity. People who claim to have experienced it describe it as a single intense moment of spiritual awakening, a radical psychological shift. Yet here you are, not even sure what ego actually means.",
      choices: [
        {
          text: "The monks and spirituals were correct. Let it die.",
          next: "let_it_die",
          effect: "scene4",
        },
        {
          text: "Do not murder your ego",
          next: "protect_it",
          effect: "scene5",
        },
      ],
    },
    let_it_die: {
      text: "Having a vague understanding of the objective, you conclude that for this so-called ego to die, someone has to kill it. You look inside, unsure what that even means. You look for what they call ego, this sense of self separate from the world and others. You rip and tear at memories, thoughts, and assumptions. You flood your mind with notions of 'this is not me' and 'there is no me' and sit and wait for the breakthrough. Nothing comes.",
      choices: [
        {
          text: "Ask for help",
          next: "help",
          effect: "scene1",
        },
      ],
    },
    protect_it: {
      text: "All the tales of ego death you've heard from spirituals and psychonauts sound like big words for dissociation. You believe the self isn't an illusion to look beyond but a necessary tool for survival; to discard it would be blasphemy.",
      choices: [{ text: "Continue this train of thought", next: "self_end", effect: "scene5" }],
    },
    help: {
      text: "Help comes in the form of a fungus in a Ziploc bag. Your friends swear up and down that this is it, this is the answer. You don't have an option here; let's not pretend like there is any way you're not going to ingest this funny-looking fungus.",
      choices: [{ text: "You obviously eat it, so just click away", next: "resolution", effect: "scene2" }],
    },
    resolution: {
      text: "Colors dance, and space flows. You look at the curtains and feel joy imagining what it must be like to be fabric. You completely forget what you came here to do. On the comedown, you realize how pointless your pursuit was to begin with. The real spiritual awakening was continuously being done and undone in the way you conduct yourself out in the world. You've always been aware of the workings of something larger than you. You choose to hold from judging those that had to  ingest consciousness altering substances to realise what you often knew and in moments of lack of faith only suspected",
      choices: [],
    },
    self_end: {
      text: "You don't understand what ego death is, and you don't even understand what ego means. You've never felt this unified sense of self you're supposed to discard. You've always felt like walking proof of a reluctant consensus reached between many warring factions inside your head. You choose to keep one hand on the solid ground beneath you.",
      choices: [],
    },
  },
};
