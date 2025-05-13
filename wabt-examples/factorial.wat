(module
  (func (export "fatorial") (param i32) (result i32)
    local.get 0
    call $calcfat)

  (func $calcfat (param i32) (result i32)
    local.get 0
    i32.const 0
    i32.gt_s 
    if (result i32)
      local.get 0
      local.get 0
      i32.const 1
      i32.sub
      call $calcfat
      i32.mul
      return
    else
      i32.const 1
      return
    end)
)
