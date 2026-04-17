# 设置文件夹路径
$folderPath = "c:\kangwei.vendor\桌面\kw"

# 获取所有文件并过滤出图片文件
$allFiles = Get-ChildItem -Path $folderPath
$imageFiles = $allFiles | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|gif)$' } | Sort-Object CreationTime

# 重命名文件
$counter = 1
foreach ($file in $imageFiles) {
    $extension = $file.Extension
    $newName = "康伟$counter$extension"
    
    # 重命名文件
    Rename-Item -Path $file.FullName -NewName $newName
    
    Write-Host "Renamed $($file.Name) to $newName"
    $counter++
}

Write-Host "Rename completed, renamed $($imageFiles.Count) files"
