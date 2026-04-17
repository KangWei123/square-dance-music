# 设置文件夹路径
$folderPath = "c:\kangwei.vendor\桌面\kw"

# 获取所有jpg文件并按创建时间排序
$files = Get-ChildItem -Path $folderPath -Filter "*.jpg" | Sort-Object CreationTime

# 重命名文件
$counter = 1
foreach ($file in $files) {
    $newName = "康伟$counter.jpg"
    Rename-Item -Path $file.FullName -NewName $newName
    Write-Host "Renamed $($file.Name) to $newName"
    $counter++
}

Write-Host "Rename completed, renamed $($files.Count) files"