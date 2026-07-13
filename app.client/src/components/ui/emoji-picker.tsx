import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

type EmojiData = {
  char: string;
  name: string;
  tags: string[];
};

const EMOJI_DATA: Record<string, EmojiData[]> = {
  "Smileys": [
    { char: "😀", name: "grinned", tags: ["smile", "happy"] },
    { char: "😃", name: "smiley", tags: ["happy", "joy"] },
    { char: "😄", name: "smile", tags: ["happy", "laugh"] },
    { char: "😁", name: "grin", tags: ["happy", "teeth"] },
    { char: "😆", name: "laughing", tags: ["happy", "haha"] },
    { char: "😅", name: "sweat_smile", tags: ["happy", "relief"] },
    { char: "😂", name: "joy", tags: ["happy", "laugh", "cry"] },
    { char: "🤣", name: "rofl", tags: ["happy", "laugh", "rolling"] },
    { char: "😊", name: "blush", tags: ["happy", "smile"] },
    { char: "😇", name: "angel", tags: ["happy", "halo"] },
    { char: "🙂", name: "slightly_smiling", tags: ["happy", "smile"] },
    { char: "🙃", name: "upside_down", tags: ["funny", "flipped"] },
    { char: "😉", name: "wink", tags: ["smile", "flirt"] },
    { char: "😌", name: "relieved", tags: ["happy", "calm"] },
    { char: "😍", name: "heart_eyes", tags: ["love", "smile", "heart"] },
    { char: "🥰", name: "smiling_face_with_three_hearts", tags: ["love", "happy"] },
    { char: "😘", name: "kissing_heart", tags: ["love", "kiss"] },
    { char: "😋", name: "yum", tags: ["happy", "food", "tasty"] },
    { char: "😛", name: "stuck_out_tongue", tags: ["funny", "playful"] },
    { char: "😜", name: "stuck_out_tongue_winking_eye", tags: ["funny", "wink"] },
    { char: "🤪", name: "zany", tags: ["funny", "crazy"] },
    { char: "🤨", name: "raised_eyebrow", tags: ["thinking", "skeptical"] },
    { char: "🧐", name: "monocle", tags: ["thinking", "investigate"] },
    { char: "🤓", name: "nerd", tags: ["smart", "glasses"] },
    { char: "😎", name: "sunglasses", tags: ["cool", "happy"] },
    { char: "🤩", name: "star_struck", tags: ["star", "excited"] },
    { char: "🥳", name: "partying", tags: ["party", "happy", "celebrate"] },
    { char: "😏", name: "smirk", tags: ["cool", "smug"] },
    { char: "😒", name: "unamused", tags: ["bored", "skeptical"] },
    { char: "😞", name: "disappointed", tags: ["sad"] },
    { char: "😔", name: "pensive", tags: ["sad", "calm"] },
    { char: "😟", name: "worried", tags: ["sad", "anxious"] },
    { char: "😕", name: "confused", tags: ["thinking", "puzzled"] },
    { char: "🙁", name: "slightly_frowning", tags: ["sad"] },
    { char: "☹️", name: "frowning", tags: ["sad"] },
    { char: "😮", name: "open_mouth", tags: ["surprised", "wow"] },
    { char: "😯", name: "hushed", tags: ["surprised"] },
    { char: "😲", name: "astonished", tags: ["surprised", "wow"] },
    { char: "😳", name: "flushed", tags: ["surprised", "blush"] },
    { char: "🥺", name: "pleading", tags: ["sad", "cute"] },
    { char: "😦", name: "frowning_with_open_mouth", tags: ["surprised", "sad"] },
    { char: "😧", name: "anguished", tags: ["surprised", "sad"] },
    { char: "😨", name: "fearful", tags: ["scared", "surprised"] },
    { char: "😰", name: "cold_sweat", tags: ["scared", "anxious"] },
    { char: "😥", name: "disappointed_relieved", tags: ["sad", "relief"] },
    { char: "😢", name: "cry", tags: ["sad", "tear"] },
    { char: "😭", name: "sob", tags: ["sad", "cry", "tear"] },
    { char: "😱", name: "scream", tags: ["scared", "surprised", "wow"] },
    { char: "😖", name: "confounded", tags: ["sad", "frustrated"] },
    { char: "😣", name: "persevere", tags: ["sad", "frustrated"] },
    { char: "😓", name: "sweat", tags: ["sad", "anxious"] },
    { char: "😩", name: "weary", tags: ["sad", "tired"] },
    { char: "😫", name: "tired_face", tags: ["sad", "tired"] },
    { char: "🥱", name: "yawning", tags: ["tired", "sleepy"] },
    { char: "😤", name: "triumph", tags: ["angry", "proud"] },
    { char: "😡", name: "rage", tags: ["angry"] },
    { char: "😠", name: "angry", tags: ["angry"] },
    { char: "🤬", name: "cursing", tags: ["angry"] },
    { char: "😈", name: "smiling_imp", tags: ["evil", "devil"] },
    { char: "👿", name: "imp", tags: ["evil", "devil"] },
    { char: "💀", name: "skull", tags: ["dead", "death"] },
    { char: "💩", name: "poop", tags: ["funny"] },
    { char: "🤡", name: "clown", tags: ["funny"] },
    { char: "👹", name: "ogre", tags: ["monster"] },
    { char: "👺", name: "goblin", tags: ["monster"] },
    { char: "👻", name: "ghost", tags: ["monster", "dead"] },
    { char: "👽", name: "alien", tags: ["monster", "space"] },
    { char: "👾", name: "robot_alien", tags: ["monster", "space", "game"] },
    { char: "🤖", name: "robot", tags: ["tech", "ai"] },
    { char: "✅", name: "check", tags: ["task", "done"] },
  ],
  "Objects": [
    { char: "⌚", name: "watch", tags: ["time", "clock"] },
    { char: "📱", name: "phone", tags: ["tech", "mobile"] },
    { char: "📲", name: "mobile", tags: ["tech", "phone"] },
    { char: "💻", name: "laptop", tags: ["tech", "work"] },
    { char: "⌨️", name: "keyboard", tags: ["tech", "typing"] },
    { char: "🖱️", name: "mouse", tags: ["tech", "control"] },
    { char: "🕹️", name: "joystick", tags: ["game", "play"] },
    { char: "🖲️", name: "trackball", tags: ["tech"] },
    { char: "🗜️", name: "clamp", tags: ["tool"] },
    { char: "💽", name: "minidisc", tags: ["tech", "disk"] },
    { char: "💾", name: "floppy", tags: ["tech", "save"] },
    { char: "💿", name: "cd", tags: ["tech", "music"] },
    { char: "📀", name: "dvd", tags: ["tech", "movie"] },
    { char: "📼", name: "vhs", tags: ["tech", "movie"] },
    { char: "📷", name: "camera", tags: ["photo"] },
    { char: "📸", name: "camera_with_flash", tags: ["photo"] },
    { char: "📹", name: "video_camera", tags: ["video"] },
    { char: "🎥", name: "movie_camera", tags: ["video", "movie"] },
    { char: "📽️", name: "projector", tags: ["video", "movie"] },
    { char: "🎞️", name: "film", tags: ["video", "movie"] },
    { char: "📞", name: "telephone", tags: ["phone", "call"] },
    { char: "☎️", name: "phone", tags: ["call"] },
    { char: "📟", name: "pager", tags: ["tech"] },
    { char: "📠", name: "fax", tags: ["tech"] },
    { char: "📺", name: "tv", tags: ["video", "movie"] },
    { char: "📻", name: "radio", tags: ["music"] },
    { char: "🎙️", name: "microphone", tags: ["music", "audio"] },
    { char: "🎚️", name: "slider", tags: ["control"] },
    { char: "🎛️", name: "knobs", tags: ["control"] },
    { char: "🧭", name: "compass", tags: ["travel", "direction"] },
    { char: "⏱️", name: "stopwatch", tags: ["time"] },
    { char: "⏲️", name: "timer", tags: ["time"] },
    { char: "⏰", name: "alarm_clock", tags: ["time"] },
    { char: "🕰️", name: "mantelpiece_clock", tags: ["time"] },
    { char: "⌛", name: "hourglass", tags: ["time"] },
    { char: "⏳", name: "hourglass_flowing", tags: ["time"] },
    { char: "📡", name: "satellite", tags: ["tech", "space"] },
    { char: "🔋", name: "battery", tags: ["tech", "power"] },
    { char: "🔌", name: "plug", tags: ["tech", "power"] },
    { char: "💡", name: "light_bulb", tags: ["idea", "light"] },
    { char: "flashlight", name: "flashlight", tags: ["light"] },
    { char: "🕯️", name: "candle", tags: ["light"] },
    { char: "🪔", name: "diya", tags: ["light"] },
    { char: "🧯", name: "fire_extinguisher", tags: ["safety"] },
    { char: "🗑️", name: "trash", tags: ["delete", "remove"] },
    { char: "🛢️", name: "oil", tags: ["energy"] },
    { char: "💸", name: "money_with_wings", tags: ["money", "fly"] },
    { char: "💵", name: "dollar", tags: ["money", "cash"] },
    { char: "💴", name: "yen", tags: ["money", "cash"] },
    { char: "💶", name: "euro", tags: ["money", "cash"] },
    { char: "💷", name: "pound", tags: ["money", "cash"] },
    { char: "🪙", name: "coin", tags: ["money", "cash"] },
    { char: "💰", name: "money_bag", tags: ["money", "rich"] },
    { char: "💳", name: "credit_card", tags: ["money", "pay"] },
    { char: "💎", name: "gem", tags: ["rich", "expensive"] },
    { char: "⚖️", name: "balance", tags: ["justice", "law"] },
    { char: "🪜", name: "ladder", tags: ["climb"] },
    { char: "🧰", name: "toolbox", tags: ["tools", "fix"] },
    { char: "🪛", name: "screwdriver", tags: ["tools", "fix"] },
    { char: "🔧", name: "wrench", tags: ["tools", "fix"] },
    { char: "🔨", name: "hammer", tags: ["tools"] },
    { char: "⚒️", name: "hammer_and_pick", tags: ["tools", "mine"] },
    { char: "🛠️", name: "hammer_and_wrench", tags: ["tools", "fix"] },
    { char: "⛏️", name: "pick", tags: ["tools", "mine"] },
    { char: "🪚", name: "saw", tags: ["tools", "cut"] },
    { char: "🔩", name: "nut_and_bolt", tags: ["tools", "fix"] },
    { char: "⚙️", name: "gear", tags: ["settings", "process"] },
    { char: "🧱", name: "brick", tags: ["build"] },
    { char: "⛓️", name: "chains", tags: ["lock", "bond"] },
    { char: "🪝", name: "hook", tags: ["catch"] },
    { char: "🧲", name: "magnet", tags: ["attract"] },
    { char: "🔫", name: "pistol", tags: ["weapon", "gun"] },
    { char: "💣", name: "bomb", tags: ["danger", "explosion"] },
    { char: "🧨", name: "firecracker", tags: ["celebrate", "explosion"] },
    { char: "🪓", name: "axe", tags: ["tool", "cut"] },
    { char: "🔪", name: "knife", tags: ["tool", "cut", "kitchen"] },
    { char: "🗡️", name: "dagger", tags: ["weapon"] },
    { char: "⚔️", name: "swords", tags: ["weapon", "battle"] },
    { char: "🛡️", name: "shield", tags: ["protection", "safe"] },
    { char: "📅", name: "calendar", tags: ["date", "time", "event", "schedule"] },
    { char: "📆", name: "calendar_tear", tags: ["date", "time", "event"] },
    { char: "🗓️", name: "spiral_calendar", tags: ["date", "time", "event", "calendar"] },
    { char: "📅", name: "calendar_icon", tags: ["schedule", "plan"] },
  ],
  "Activities": [
    { char: "⚽", name: "soccer", tags: ["sport", "ball"] },
    { char: "🏀", name: "basketball", tags: ["sport", "ball"] },
    { char: "🏈", name: "football", tags: ["sport", "ball"] },
    { char: "⚾", name: "baseball", tags: ["sport", "ball"] },
    { char: "🥎", name: "softball", tags: ["sport", "ball"] },
    { char: "🎾", name: "tennis", tags: ["sport", "ball"] },
    { char: "🏐", name: "volleyball", tags: ["sport", "ball"] },
    { char: "🏉", name: "rugby", tags: ["sport", "ball"] },
    { char: "🎱", name: "8ball", tags: ["sport", "ball", "pool"] },
    { char: "🏓", name: "ping_pong", tags: ["sport"] },
    { char: "🏸", name: "badminton", tags: ["sport"] },
    { char: "🏒", name: "ice_hockey", tags: ["sport"] },
    { char: "🏑", name: "field_hockey", tags: ["sport"] },
    { char: "🥍", name: "lacrosse", tags: ["sport"] },
    { char: "🏏", name: "cricket", tags: ["sport"] },
    { char: "⛳", name: "golf", tags: ["sport"] },
    { char: "🏹", name: "archery", tags: ["sport"] },
    { char: "🎣", name: "fishing", tags: ["sport", "hobby"] },
    { char: "🥊", name: "boxing", tags: ["sport", "fight"] },
    { char: "🥋", name: "martial_arts", tags: ["sport", "fight"] },
    { char: "⛸️", name: "ice_skate", tags: ["sport"] },
    { char: "🎿", name: "ski", tags: ["sport", "snow"] },
    { char: "⛷️", name: "skier", tags: ["sport", "snow"] },
    { char: "🏂", name: "snowboarder", tags: ["sport", "snow"] },
    { char: "🏋️", name: "weightlifting", tags: ["sport", "gym"] },
    { char: "🤺", name: "fencing", tags: ["sport", "fight"] },
    { char: "🏇", name: "horse_racing", tags: ["sport"] },
    { char: "🧘", name: "yoga", tags: ["sport", "calm"] },
    { char: "🏄", name: "surfing", tags: ["sport", "water"] },
    { char: "🏊", name: "swimming", tags: ["sport", "water"] },
    { char: "🤽", name: "water_polo", tags: ["sport", "water"] },
    { char: "🚣", name: "rowing", tags: ["sport", "water"] },
    { char: "🧗", name: "climbing", tags: ["sport", "hobby"] },
    { char: "🚵", name: "mountain_biking", tags: ["sport", "bike"] },
    { char: "🚴", name: "cycling", tags: ["sport", "bike"] },
    { char: "🏆", name: "trophy", tags: ["win", "award"] },
    { char: "🥇", name: "medal_1st", tags: ["win", "award"] },
    { char: "🥈", name: "medal_2nd", tags: ["win", "award"] },
    { char: "🥉", name: "medal_3rd", tags: ["win", "award"] },
    { char: "🏅", name: "medal", tags: ["win", "award"] },
    { char: "🎖️", name: "military_medal", tags: ["win", "award"] },
  ],
  "Travel": [
    { char: "🚗", name: "car", tags: ["travel", "vehicle"] },
    { char: "taxi", name: "taxi", tags: ["travel", "vehicle"] },
    { char: "🚙", name: "suv", tags: ["travel", "vehicle"] },
    { char: "🚌", name: "bus", tags: ["travel", "vehicle"] },
    { char: "🚎", name: "trolleybus", tags: ["travel", "vehicle"] },
    { char: "🏎️", name: "race_car", tags: ["travel", "vehicle"] },
    { char: "🚓", name: "police_car", tags: ["travel", "vehicle"] },
    { char: "🚒", name: "fire_engine", tags: ["travel", "vehicle"] },
    { char: "🚐", name: "minibus", tags: ["travel", "vehicle"] },
    { char: "🛻", name: "pickup_truck", tags: ["travel", "vehicle"] },
    { char: "🚚", name: "delivery_truck", tags: ["travel", "vehicle"] },
    { char: "🚛", name: "articulated_lorry", tags: ["travel", "vehicle"] },
    { char: "🚜", name: "tractor", tags: ["travel", "vehicle"] },
    { char: "🏍️", name: "motorcycle", tags: ["travel", "vehicle"] },
    { char: "🛵", name: "motor_scooter", tags: ["travel", "vehicle"] },
    { char: "🚲", name: "bicycle", tags: ["travel", "vehicle"] },
    { char: "🛺", name: "kick_scooter", tags: ["travel", "vehicle"] },
    { char: "🚁", name: "helicopter", tags: ["travel", "air"] },
    { char: "🚀", name: "rocket", tags: ["travel", "space"] },
    { char: "🛸", name: "ufo", tags: ["travel", "space"] },
    { char: "⛵", name: "sailboat", tags: ["travel", "water"] },
    { char: "speedboat", name: "speedboat", tags: ["travel", "water"] },
    { char: "⛴️", name: "ferry", tags: ["travel", "water"] },
    { char: "🛳️", name: "passenger_ship", tags: ["travel", "water"] },
    { char: "🚢", name: "ship", tags: ["travel", "water"] },
    { char: "✈️", name: "airplane", tags: ["travel", "air"] },
    { char: "🛩️", name: "small_airplane", tags: ["travel", "air"] },
    { char: "🛫", name: "takeoff", tags: ["travel", "air"] },
    { char: "🛬", name: "landing", tags: ["travel", "air"] },
    { char: "💺", name: "seat", tags: ["travel"] },
    { char: "🚆", name: "train", tags: ["travel"] },
    { char: "🚇", name: "metro", tags: ["travel"] },
    { char: "🚊", name: "tram", tags: ["travel"] },
    { char: "🏠", name: "house", tags: ["building", "home"] },
    { char: "🏡", name: "house_with_garden", tags: ["building", "home"] },
    { char: "🏢", name: "office", tags: ["building", "work"] },
    { char: "🏦", name: "bank", tags: ["building", "money"] },
    { char: "🏫", name: "school", tags: ["building", "education"] },
    { char: "🏰", name: "castle", tags: ["building"] },
  ],
};

const CATEGORIES = [
  { name: "Smileys", icon: "😀" },
  { name: "Objects", icon: "💡" },
  { name: "Activities", icon: "⚽" },
  { name: "Travel", icon: "🚗" },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onRemove?: () => void;
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onRemove, className }) => {
  const [activeCategory, setActiveCategory] = useState("Smileys" as keyof typeof EMOJI_DATA);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmojis = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return EMOJI_DATA[activeCategory] || [];

    const results: EmojiData[] = [];
    Object.values(EMOJI_DATA).forEach((category) => {
      category.forEach((emoji) => {
        const matches =
          emoji.name.toLowerCase().includes(query) ||
          emoji.tags.some(tag => tag.toLowerCase().includes(query)) ||
          emoji.char === query;

        if (matches && !results.some(r => r.char === emoji.char)) {
          results.push(emoji);
        }
      });
    });
    return results;
  }, [searchQuery, activeCategory]);

  return (
    <div className={cn("w-[280px] bg-white dark:bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden", className)}>
      {/* Category Tabs */}
      <div className="flex items-center justify-between px-2 pt-2 border-b border-zinc-800">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => {
              setActiveCategory(category.name as keyof typeof EMOJI_DATA);
              setSearchQuery("");
            }}
            className={cn(
              "p-2 text-lg hover:bg-zinc-200 rounded-md transition-colors relative",
              activeCategory === category.name && !searchQuery && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
            )}
            title={category.name}
          >
            {category.icon}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 " />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 pr-7 h-8 dark:bg-zinc-800 bg-white border-1 text-xs text-white placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Emoji Grid */}
      <div className="px-2 pb-2 h-[200px] overflow-y-auto scrollbar-hide">
        <p className="text-[10px] uppercase font-bold text-zinc-500 mb-2 px-1">
          {searchQuery ? `Search Results (${filteredEmojis.length})` : activeCategory}
        </p>
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji.char}-${index}`}
              onClick={() => onSelect(emoji.char)}
              title={emoji.name}
              className="w-7 h-7 flex items-center justify-center text-lg hover:bg-zinc-200 rounded-md transition-colors"
            >
              {emoji.char}
            </button>
          ))}
          {filteredEmojis.length === 0 && (
            <div className="col-span-8 text-center py-8 text-xs text-zinc-600 italic">
              No emojis found
            </div>
          )}
        </div>
      </div>

      {/* Remove Option */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="w-full p-2 text-xs text-zinc-400   border-t border-zinc-800 transition-colors flex items-center gap-2"
        >
          <span className="w-4 h-4 flex items-center justify-center border border-zinc-700 rounded-sm">✕</span>
          Remove icon
        </button>
      )}
    </div>
  );
};
