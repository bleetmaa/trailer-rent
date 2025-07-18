# Fix Rock 5 SE Partition - Step by Step

## Current Status
- **Total SD Card**: 29.7GB 
- **Partition 1**: 28M (boot)
- **Partition 2**: 3.5G (root filesystem) 
- **Unallocated**: ~26GB unused!

## Solution: Use parted to expand partition 2

### Step 1: Install required tools
```bash
sudo apt update
sudo apt install -y parted util-linux
```

### Step 2: Expand the partition
```bash
# Show current partition table
sudo parted /dev/mmcblk1 print

# Resize partition 2 to use remaining space
sudo parted /dev/mmcblk1 resizepart 2 100%

# Check the new partition table
sudo parted /dev/mmcblk1 print
```

### Step 3: Resize the filesystem
```bash
# Now resize the filesystem to use the expanded partition
sudo resize2fs /dev/mmcblk1p2

# Check the new size
df -h /
```

### Alternative: Using cfdisk (interactive)
```bash
# If parted doesn't work, try cfdisk
sudo apt install -y fdisk
sudo cfdisk /dev/mmcblk1

# In cfdisk:
# 1. Select partition 2
# 2. Choose "Resize" 
# 3. Set to maximum size
# 4. Write changes
# 5. Quit

# Then resize filesystem
sudo resize2fs /dev/mmcblk1p2
```

## Expected Result
After expansion:
```
/dev/mmcblk1p2   28G  2.7G   24G  10% /
```

## If Everything Else Fails: Manual Method
```bash
# Delete and recreate partition 2 (DANGEROUS - backup first!)
sudo parted /dev/mmcblk1
> rm 2
> mkpart primary ext4 28MB 100%
> quit

sudo resize2fs /dev/mmcblk1p2
```

Your 29.7GB SD card should give you ~24-25GB usable space after expansion! 🚀
