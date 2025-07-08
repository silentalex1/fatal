import discord
import random
import string
from discord.ext import commands

intents = discord.Intents.all()
bot = commands.Bot(command_prefix="$", intents=intents)

keys = {}
active_keys = {}

def generate_key():
    return "fatal_" + ''.join(random.choices(string.ascii_letters + string.digits, k=9))

@bot.command()
async def createkey(ctx, name, duration):
    key = generate_key()
    keys[key] = {"name": name, "time": duration}
    embed = discord.Embed(title="Key Created", color=discord.Color.red())
    embed.add_field(name="Key", value=f"`{key}`", inline=False)
    embed.add_field(name="Assigned To", value=name, inline=True)
    embed.add_field(name="Duration", value=duration, inline=True)
    await ctx.send(embed=embed)

@bot.command()
async def keyverify(ctx, key):
    if key in keys:
        if key not in active_keys:
            active_keys[key] = True
            embed = discord.Embed(title="Key Verified", description="Key has been activated.", color=discord.Color.green())
            embed.add_field(name="Key", value=f"`{key}`", inline=False)
            await ctx.send(embed=embed)
        else:
            embed = discord.Embed(title="Already Active", description="This key is already verified.", color=discord.Color.orange())
            await ctx.send(embed=embed)
    else:
        embed = discord.Embed(title="Invalid Key", description="Key does not exist.", color=discord.Color.dark_red())
        await ctx.send(embed=embed)

@bot.command()
async def cmds(ctx):
    commands_list = (
        "`$createkey <name> <duration>` - Create a new key\n"
        "`$keyverify <key>` - Verify and activate a key\n"
        "`$cmds` - List commands"
    )
    embed = discord.Embed(title="Commands", description=commands_list, color=discord.Color.blue())
    await ctx.send(embed=embed)

bot.run("bot here")
