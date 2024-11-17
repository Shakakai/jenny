{pkgs}: {
  deps = [
    pkgs.nodejs
    pkgs.nodePackages.typescript-language-server
    pkgs.postgresql
    pkgs.python311Full.out
  ];
}
