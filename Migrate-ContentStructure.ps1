# Migrate-ContentStructure.ps1
# Restructures wyrdstone.wiki content from faction-based nav to grade-based nav.
#
# BEFORE:
#   content/core-8/          content/chaos/        content/dwarfs/
#   content/elves/           content/greenskins/   content/human/
#   content/lustria/         content/undead/       content/unofficial/
#   content/reference/       (flat -- skills, spells, etc. all at top level)
#
# AFTER:
#   content/reference/warbands/grade-1a/     (Core 8 + Beastmen + Averlanders + Kislevites)
#   content/reference/warbands/grade-1b/     (26 grade-1b warbands + other stubs)
#   content/reference/warbands/grade-1c/     (no stubs -- Grade 1C pages built separately)
#   content/reference/warbands/unofficial/   (Brazen Tithe)
#   content/reference/rules/                 (skills, spells, special-rules, etc.)
#
# Run from the Quartz clone root:
#   cd C:\Users\PA14250\Documents\mordheim-site\quartz
#   .\Migrate-ContentStructure.ps1
#
# The script is IDEMPOTENT -- safe to re-run. It only moves files that exist
# and skips any that are already in the right place.
#
# IMPORTANT -- draft stubs classification:
#   Kislevites             -> grade-1a (official GW warband, Annual)
#   Averlander Mercenaries -> grade-1a (official GW warband)
#   Wood Elves             -> grade-1b stub (blocked on QM YAML pause)
#   Hobgoblin Raiders      -> grade-1b stub
#   Orcs & Goblins BTB    -> grade-1b stub
#   Knights Panther        -> grade-1b stub
#   Ostlander Mercenaries  -> grade-1b stub
#   Dwarfs of Karak Azgal  -> grade-1b stub
#   These are NOT Grade 1C warbands. Grade 1C = community experimental warbands
#   (Battle Monks, Black Dwarfs, Bretonnian Chapel Guard, etc.)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = "content"

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Move-IfExists {
    param([string]$Src, [string]$Dst)
    if (Test-Path $Src) {
        $dir = Split-Path $Dst -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        if (Test-Path $Dst) {
            Write-Host "  SKIP (already exists): $Dst" -ForegroundColor Yellow
        } else {
            Move-Item -Path $Src -Destination $Dst
            Write-Host "  MOVED: $Src  ->  $Dst" -ForegroundColor Green
        }
    } else {
        Write-Host "  NOT FOUND (skip): $Src" -ForegroundColor DarkGray
    }
}

function New-DirIfMissing {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "  CREATED: $Path" -ForegroundColor Cyan
    }
}

# ---------------------------------------------------------------------------
# 1. Create new directory structure
# ---------------------------------------------------------------------------
Write-Host "`n=== Creating new directories ===" -ForegroundColor White

New-DirIfMissing "$root\reference\warbands\grade-1a"
New-DirIfMissing "$root\reference\warbands\grade-1b"
New-DirIfMissing "$root\reference\warbands\grade-1c"
New-DirIfMissing "$root\reference\warbands\unofficial"
New-DirIfMissing "$root\reference\rules"
New-DirIfMissing "$root\reference\rules\skills"
New-DirIfMissing "$root\reference\rules\spells"

# ---------------------------------------------------------------------------
# 2. Move Grade 1A warband pages
#    Core 8 (from core-8/) + Beastmen Raiders + Averlanders + Kislevites
#    These are all official GW warbands -- Grade 1A.
# ---------------------------------------------------------------------------
Write-Host "`n=== Grade 1A warbands ===" -ForegroundColor White

$grade1a = @(
    # Core 8
    @{ Src = "$root\core-8\cult-of-the-possessed.md";    Dst = "$root\reference\warbands\grade-1a\cult-of-the-possessed.md" },
    @{ Src = "$root\core-8\mercenaries-reikland.md";     Dst = "$root\reference\warbands\grade-1a\mercenaries-reikland.md" },
    @{ Src = "$root\core-8\mercenaries-middenheim.md";   Dst = "$root\reference\warbands\grade-1a\mercenaries-middenheim.md" },
    @{ Src = "$root\core-8\mercenaries-marienburg.md";   Dst = "$root\reference\warbands\grade-1a\mercenaries-marienburg.md" },
    @{ Src = "$root\core-8\sisters-of-sigmar.md";        Dst = "$root\reference\warbands\grade-1a\sisters-of-sigmar.md" },
    @{ Src = "$root\core-8\skaven.md";                   Dst = "$root\reference\warbands\grade-1a\skaven.md" },
    @{ Src = "$root\core-8\undead.md";                   Dst = "$root\reference\warbands\grade-1a\undead.md" },
    @{ Src = "$root\core-8\witch-hunters.md";            Dst = "$root\reference\warbands\grade-1a\witch-hunters.md" },
    # Grade 1A add-ons
    @{ Src = "$root\chaos\beastmen-raiders.md";          Dst = "$root\reference\warbands\grade-1a\beastmen-raiders.md" },
    @{ Src = "$root\human\averlander-mercenaries.md";    Dst = "$root\reference\warbands\grade-1a\averlander-mercenaries.md" },
    # Kislevites -- official GW Annual warband, Grade 1A
    @{ Src = "$root\human\kislevites.md";                Dst = "$root\reference\warbands\grade-1a\kislevites.md" }
)

foreach ($entry in $grade1a) { Move-IfExists $entry.Src $entry.Dst }

# ---------------------------------------------------------------------------
# 3. Move Grade 1B warband pages (from old faction folders)
#    Includes the blocked draft stubs for warbands that ARE Grade 1B
#    but await QM YAML work (they keep draft: true in their frontmatter).
# ---------------------------------------------------------------------------
Write-Host "`n=== Grade 1B warbands ===" -ForegroundColor White

$grade1b = @(
    # Chaos
    @{ Src = "$root\chaos\carnival-of-chaos.md";          Dst = "$root\reference\warbands\grade-1b\carnival-of-chaos.md" },
    @{ Src = "$root\chaos\chaos-dwarfs.md";               Dst = "$root\reference\warbands\grade-1b\chaos-dwarfs.md" },
    @{ Src = "$root\chaos\marauders-of-chaos.md";         Dst = "$root\reference\warbands\grade-1b\marauders-of-chaos.md" },
    @{ Src = "$root\chaos\norse-marauders.md";            Dst = "$root\reference\warbands\grade-1b\norse-marauders.md" },
    @{ Src = "$root\chaos\skaven-of-clan-pestilens.md";   Dst = "$root\reference\warbands\grade-1b\skaven-of-clan-pestilens.md" },
    # Dwarfs
    @{ Src = "$root\dwarfs\dwarf-treasure-hunters.md";    Dst = "$root\reference\warbands\grade-1b\dwarf-treasure-hunters.md" },
    # Dwarfs of Karak Azgal -- Grade 1B stub (blocked on QM YAML, draft: true)
    @{ Src = "$root\dwarfs\dwarfs-of-karak-azgal.md";    Dst = "$root\reference\warbands\grade-1b\dwarfs-of-karak-azgal.md" },
    # Elves
    @{ Src = "$root\elves\dark-elves.md";                 Dst = "$root\reference\warbands\grade-1b\dark-elves.md" },
    @{ Src = "$root\elves\shadow-warriors.md";            Dst = "$root\reference\warbands\grade-1b\shadow-warriors.md" },
    # Wood Elves -- Grade 1B stub (blocked on QM YAML, draft: true)
    @{ Src = "$root\elves\wood-elves.md";                 Dst = "$root\reference\warbands\grade-1b\wood-elves.md" },
    # Greenskins
    @{ Src = "$root\greenskins\orc-mob.md";               Dst = "$root\reference\warbands\grade-1b\orc-mob.md" },
    @{ Src = "$root\greenskins\forest-goblins.md";        Dst = "$root\reference\warbands\grade-1b\forest-goblins.md" },
    # Hobgoblin Raiders -- Grade 1B stub
    @{ Src = "$root\greenskins\hobgoblin-raiders.md";                   Dst = "$root\reference\warbands\grade-1b\hobgoblin-raiders.md" },
    # Orcs & Goblins of the Bloody Sun -- Grade 1B stub
    @{ Src = "$root\greenskins\orcs-and-goblins-of-the-bloody-sun.md"; Dst = "$root\reference\warbands\grade-1b\orcs-and-goblins-of-the-bloody-sun.md" },
    # Human
    @{ Src = "$root\human\arabian-tomb-raiders.md";       Dst = "$root\reference\warbands\grade-1b\arabian-tomb-raiders.md" },
    @{ Src = "$root\human\bretonnians.md";                Dst = "$root\reference\warbands\grade-1b\bretonnians.md" },
    @{ Src = "$root\human\gunnery-school-of-nuln.md";    Dst = "$root\reference\warbands\grade-1b\gunnery-school-of-nuln.md" },
    @{ Src = "$root\human\hochland-bandits.md";           Dst = "$root\reference\warbands\grade-1b\hochland-bandits.md" },
    @{ Src = "$root\human\horned-hunters.md";             Dst = "$root\reference\warbands\grade-1b\horned-hunters.md" },
    @{ Src = "$root\human\imperial-outriders.md";         Dst = "$root\reference\warbands\grade-1b\imperial-outriders.md" },
    # Knights Panther -- Grade 1B stub
    @{ Src = "$root\human\knights-panther.md";            Dst = "$root\reference\warbands\grade-1b\knights-panther.md" },
    @{ Src = "$root\human\miragleans.md";                 Dst = "$root\reference\warbands\grade-1b\miragleans.md" },
    @{ Src = "$root\human\mootlanders.md";                Dst = "$root\reference\warbands\grade-1b\mootlanders.md" },
    @{ Src = "$root\human\norse-explorers.md";            Dst = "$root\reference\warbands\grade-1b\norse-explorers.md" },
    @{ Src = "$root\human\ostermarkers.md";               Dst = "$root\reference\warbands\grade-1b\ostermarkers.md" },
    # Ostlander Mercenaries -- Grade 1B stub
    @{ Src = "$root\human\ostlander-mercenaries.md";      Dst = "$root\reference\warbands\grade-1b\ostlander-mercenaries.md" },
    @{ Src = "$root\human\outlaws-of-stirwood-forest.md"; Dst = "$root\reference\warbands\grade-1b\outlaws-of-stirwood-forest.md" },
    @{ Src = "$root\human\pirates.md";                   Dst = "$root\reference\warbands\grade-1b\pirates.md" },
    @{ Src = "$root\human\pit-fighters.md";              Dst = "$root\reference\warbands\grade-1b\pit-fighters.md" },
    @{ Src = "$root\human\remasens.md";                  Dst = "$root\reference\warbands\grade-1b\remasens.md" },
    @{ Src = "$root\human\tileans.md";                   Dst = "$root\reference\warbands\grade-1b\tileans.md" },
    @{ Src = "$root\human\trantios.md";                  Dst = "$root\reference\warbands\grade-1b\trantios.md" },
    # Lustria
    @{ Src = "$root\lustria\amazons.md";                 Dst = "$root\reference\warbands\grade-1b\amazons.md" },
    @{ Src = "$root\lustria\amazons-mordheim.md";        Dst = "$root\reference\warbands\grade-1b\amazons-mordheim.md" },
    @{ Src = "$root\lustria\lizardmen.md";               Dst = "$root\reference\warbands\grade-1b\lizardmen.md" },
    # Undead
    @{ Src = "$root\undead\tomb-guardians.md";           Dst = "$root\reference\warbands\grade-1b\tomb-guardians.md" }
)

foreach ($entry in $grade1b) { Move-IfExists $entry.Src $entry.Dst }

# ---------------------------------------------------------------------------
# 4. Move Unofficial warband pages
# ---------------------------------------------------------------------------
Write-Host "`n=== Unofficial warbands ===" -ForegroundColor White

$unofficial = @(
    @{ Src = "$root\unofficial\brazen-tithe.md"; Dst = "$root\reference\warbands\unofficial\brazen-tithe.md" }
)

foreach ($entry in $unofficial) { Move-IfExists $entry.Src $entry.Dst }

# ---------------------------------------------------------------------------
# 5. Move reference rule pages into reference/rules/
# ---------------------------------------------------------------------------
Write-Host "`n=== Reference rules ===" -ForegroundColor White

$rules = @(
    @{ Src = "$root\reference\special-rules.md";         Dst = "$root\reference\rules\special-rules.md" },
    @{ Src = "$root\reference\injury-table.md";          Dst = "$root\reference\rules\injury-table.md" },
    @{ Src = "$root\reference\hired-swords.md";          Dst = "$root\reference\rules\hired-swords.md" },
    @{ Src = "$root\reference\exploration-chart.md";     Dst = "$root\reference\rules\exploration-chart.md" },
    @{ Src = "$root\reference\post-battle.md";           Dst = "$root\reference\rules\post-battle.md" },
    @{ Src = "$root\reference\trading-post.md";          Dst = "$root\reference\rules\trading-post.md" },
    # Skills index + sub-pages
    @{ Src = "$root\reference\skills.md";                Dst = "$root\reference\rules\skills.md" },
    @{ Src = "$root\reference\skills\combat.md";         Dst = "$root\reference\rules\skills\combat.md" },
    @{ Src = "$root\reference\skills\shooting.md";       Dst = "$root\reference\rules\skills\shooting.md" },
    @{ Src = "$root\reference\skills\academic.md";       Dst = "$root\reference\rules\skills\academic.md" },
    @{ Src = "$root\reference\skills\strength.md";       Dst = "$root\reference\rules\skills\strength.md" },
    @{ Src = "$root\reference\skills\speed.md";          Dst = "$root\reference\rules\skills\speed.md" },
    # Spells index + sub-pages
    @{ Src = "$root\reference\spells.md";                Dst = "$root\reference\rules\spells.md" },
    @{ Src = "$root\reference\spells\lesser-magic.md";   Dst = "$root\reference\rules\spells\lesser-magic.md" },
    @{ Src = "$root\reference\spells\chaos-rituals.md";  Dst = "$root\reference\rules\spells\chaos-rituals.md" },
    @{ Src = "$root\reference\spells\necromancy.md";     Dst = "$root\reference\rules\spells\necromancy.md" },
    @{ Src = "$root\reference\spells\prayers-of-sigmar.md"; Dst = "$root\reference\rules\spells\prayers-of-sigmar.md" },
    @{ Src = "$root\reference\spells\skaven-magic.md";   Dst = "$root\reference\rules\spells\skaven-magic.md" },
    @{ Src = "$root\reference\spells\nurgle-rituals.md"; Dst = "$root\reference\rules\spells\nurgle-rituals.md" },
    @{ Src = "$root\reference\spells\rituals-of-hashut.md"; Dst = "$root\reference\rules\spells\rituals-of-hashut.md" }
)

foreach ($entry in $rules) { Move-IfExists $entry.Src $entry.Dst }

# ---------------------------------------------------------------------------
# 6. Remove now-empty old category folders
#    Only removes if actually empty after moves (safe -- won't destroy leftover files)
# ---------------------------------------------------------------------------
Write-Host "`n=== Removing old empty category folders ===" -ForegroundColor White

$oldFolders = @(
    "$root\core-8",
    "$root\chaos",
    "$root\dwarfs",
    "$root\elves",
    "$root\greenskins",
    "$root\human",
    "$root\lustria",
    "$root\undead",
    "$root\unofficial",
    "$root\reference\skills",
    "$root\reference\spells"
)

foreach ($folder in $oldFolders) {
    if (Test-Path $folder) {
        $remaining = Get-ChildItem $folder -Recurse -File
        if ($remaining.Count -eq 0) {
            Remove-Item $folder -Recurse -Force
            Write-Host "  REMOVED: $folder" -ForegroundColor Magenta
        } else {
            Write-Host "  NOT EMPTY -- left in place: $folder ($($remaining.Count) file(s) remain)" -ForegroundColor Yellow
            $remaining | ForEach-Object { Write-Host "    -> $($_.FullName)" -ForegroundColor Yellow }
        }
    } else {
        Write-Host "  ALREADY GONE: $folder" -ForegroundColor DarkGray
    }
}

Write-Host "`n=== Migration complete ===" -ForegroundColor White
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Place the new index.md files from outputs into their destinations" -ForegroundColor Cyan
Write-Host "  2. Replace quartz.layout.ts at the clone root" -ForegroundColor Cyan
Write-Host "  3. git add . && git commit -m 'Restructure nav: grade-based warband hierarchy' && git push origin main" -ForegroundColor Cyan
